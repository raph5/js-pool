import { mixRgbaLayers } from './colors'
import { HIEGHT, WIDTH } from "./settings"

/**
 * @typedef { import("./colors").Rgba } Rgba
 * 
 * Coordinate : [ x, y ]
 * @typedef coordinate
 * @type {[number, number]}
 */


/** Layer */
export class Layer {

  /**
   * @param { Renderer } renderer
  */
 constructor(renderer) {
    /** @type {Rgba[][]} how to get a pixel : data[x][y] */
    this.data = []
    for(let x=0; x<WIDTH; x++) {
      this.data.push([])
      for(let y=0; y<HIEGHT; y++) {
        this.data[x].push({ r:0, g:0, b:0, a:0 })
      }
    }

    /** @type {Renderer} */
    this.renderer = renderer
    renderer.layers.push(this)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {Rgba} color
   */
  set(x, y, color) {
    this.data[x][y] = color
    this.renderer.addChange(x, y)
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

/** Renderer */
export class Renderer {

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas
    
    const _c = canvas.getContext('2d')
    if(_c) {
      /** @type {CanvasRenderingContext2D} */
      this.ctx = _c
    }

    /** @type {Layer[]} */
    this.layers = []

    /** @type {coordinate[]} */
    this.changes = []
    /** @type {Set.<string>} */
    this._changesSet = new Set()
  }

  /**
   * Change all the pixel that changed from one frame to an other
   */
  render() {
    const imageData = this.ctx.createImageData(WIDTH, HIEGHT)

    for(const change of this.changes) {
      const pixelIndex = 4 * (change[0] + change[1]*WIDTH)
      const layersPixels = this.layers.map(l => l.get(change[0], change[1]))
      
      const { r, g, b, a } = mixRgbaLayers(layersPixels)
      imageData.data[pixelIndex + 0] = r
      imageData.data[pixelIndex + 1] = g
      imageData.data[pixelIndex + 2] = b
      imageData.data[pixelIndex + 3] = a
      // if(change[1] == 51) {
      //   console.log(change, layersPixels, change[0], change[1])
      // }
    }

    this.ctx.putImageData(imageData, 0, 0)
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  addChange(x, y) {
    const pair = `${x}:${y}`
    if(!this._changesSet.has(pair)) {
      this.changes.push([x, y])
      this._changesSet.add(pair)
    }
  }

}