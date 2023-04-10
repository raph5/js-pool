import { mixRgbaLayers } from './colors'
import { HIEGHT, WIDTH } from "./settings"
import { coordinates2D, pixelMap, rgb, rgba } from './types'


// Layer
export class Layer {

  // how to get a pixel : data[x][y]
  private data: Array<Array<rgba>> = new Array<Array<rgba>>(WIDTH)
  
  constructor(
    private renderer: Renderer,
    zIndex: i8
  ) {
    for(let x=0; x<WIDTH; x++) {
      this.data[x] = new Array<rgba>(HIEGHT)
      for(let y=0; y<HIEGHT; y++) {
        this.data[x][y] = [ 0, 0, 0, 0 ]
      }
    }
    
    renderer.addLayer(this, zIndex)
  }

  set(x: i16, y: i16, color: rgba): void {
    this.data[x][y] = color
    this.renderer.addChange(x, y)
  }

  get(x: i16, y: i16): rgba {
    return this.data[x][y]
  }

}


// Renderer
export class Renderer {

  private layers: Array<Layer> = new Array<Layer>(10)
  private changes: Array<coordinates2D> = new Array<coordinates2D>(WIDTH*HIEGHT)
  private _changesSet: Set<string> = new Set<string>()

  // Change all the pixel that changed from one frame to an other
  render(): pixelMap {
    const pxMap: pixelMap = new Map<coordinates2D, rgb>()

    for(let i=0; i<this.changes.length; i++) {
      const layersPixels = this.layers.map(l => l.get(this.changes[i][0], this.changes[i][1]))
      const pixelColor = mixRgbaLayers(layersPixels)
      pxMap.set(this.changes[i], [ pixelColor[0], pixelColor[1], pixelColor[2] ])
    }

    return pxMap
  }
  
  addChange(x: i16, y: i16): void {
    const pair = `${x}:${y}`
    if(!this._changesSet.has(pair)) {
      this.changes[this._changesSet.size] = [x, y]
      this._changesSet.add(pair)
    }
  }

  addLayer(layer: Layer, zIndex: i8): void {
    this.layers[zIndex] = layer
  }

}