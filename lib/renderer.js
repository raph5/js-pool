import { HEIGHT, WIDTH } from "./settings"


/**
 * Coordinate : [ x, y ]
 * @typedef coordinate
 * @type {[number, number]}
 */

/** Layer */
export class Layer {

 constructor() {
    const dataLength = (WIDTH*HEIGHT) << 2

    this.data = new Uint8ClampedArray(dataLength)
    
    for(let i=0; i<dataLength; i++) {
      this.data[i] = 0
    }

    // togle this value to show/hide the layer
    this.visible = true
  }

}

/** Renderer */
export class Renderer {

  /**
   * @param { import("./canvas").default } canvas
   */
  constructor(canvas) {
    this.canvas = canvas
    this.layers = []
  }

  /**
   * Change all the pixel that changed from one frame to an other
   */
  render() {
    const imageData = this.canvas.ctx.createImageData(WIDTH, HEIGHT)

    const dataLength = (WIDTH*HEIGHT) << 2

    for(let i=0; i<dataLength; i+=4) {
      let r = -1
      let g = -1
      let b = -1
      let a = -1

      for(let l=this.layers.length-1; l>=0; l--) {

        // check for layer visibility
        if(this.layers[l].visible === false) continue

        const _a = this.layers[l].data[i+3]

        if(_a == 0) {
          continue
        }
        if(a == -1) {
          r = this.layers[l].data[i]
          g = this.layers[l].data[i+1]
          b = this.layers[l].data[i+2]
          a = this.layers[l].data[i+3]
        }
        if(a == 255) {
          break
        }

        
        const _v1 = ((255 - a) * _a) / 256
        const _v2 = _v1 + a
        r = (a * r + _v1 * this.layers[l].data[i]) / _v2
        g = (a * g + _v1 * this.layers[l].data[i+1]) / _v2
        b = (a * b + _v1 * this.layers[l].data[i+2]) / _v2
        a = _v2
      }

      imageData.data[i] = r
      imageData.data[i+1] = g
      imageData.data[i+2] = b
      imageData.data[i+3] = a
    }

    this.canvas.ctx.putImageData(imageData, 0, 0)
  }

}