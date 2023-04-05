import { mixRgbaColors } from './colors'
import { HIEGHT, WIDTH } from "./settings"

/**
 * @typedef { import("./colors").Rgba } Rgba
 * 
 * Coordinate : [ x, y ]
 * @typedef coordinate
 * @type {[number, number]}
 */


/**
 * Layer
 * @property {Rgba[][]}    data     how to get a pixel : data[x][y]
 * @property {coordinate[]} changes list of all changed pixels
 */
export class Layer {

  /**
   * @param {Rgba} defaultColor
   */
  constructor(defaultColor={ r:0, g:0, b:0, a:0 }) {
    this.data = Array(WIDTH).fill( Array(HIEGHT).fill(defaultColor) )
    this.changes = []

    // if defaultColor is not transparent : and of the pixels to this.changes
    if(defaultColor.a > 0) {
      const _sumPx = WIDTH * HIEGHT
      let x=0
      let y=0
      for(let i=0; i<_sumPx; i++) {
        this.changes.push([x,y])
        x = (x+1) % WIDTH
        y = x == 0 ? y+1 : y 
      }
    }
  }

  /**
   * @param {Rgba} color
   * @param {number} x
   * @param {number} y
   */
  set(color, x, y) {
    this.data[x][y] = color
    this.changes.push([x,y])
  }

  /**
   * @param {number} x
   * @param {number} y
   * @return {Rgba}
  */
  get(x, y) {
    return this.data[x][y]
  }

}

/**
 * Renderer
 */
export class Renderer {

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type {Layer[]} */
    this.layers = []
    
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas
    
    const _c = canvas.getContext('2d')
    if(_c) {
      /** @type {CanvasRenderingContext2D} */
      this.ctx = _c
    }
  }

  /**
   * Change all the pixel that changed from one frame to an other
   */
  render() {
    const imageData = this.ctx.createImageData(WIDTH, HIEGHT)

    let x=0
    let y=0
    for(let i=0; i<imageData.data.length; i+=4) {
      const layersPixels = this.layers.map(l => l.get(x, y))

      const { r, g, b, a } = mixRgbaColors(layersPixels)
      imageData.data[i + 0] = r
      imageData.data[i + 1] = g
      imageData.data[i + 2] = b
      imageData.data[i + 3] = a

      x = (x+1) % WIDTH
      y = x == 0 ? y+1 : y
    }

    this.ctx.putImageData(imageData, 0, 0)
  }

}