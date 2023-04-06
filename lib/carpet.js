import { CARPET_COLOR, HIEGHT, WIDTH } from './settings'

export default class Carpet {

  /**
   * @param { import("./renderer").Layer } layer 
   */
  constructor(layer) {
    /** @type { import("./renderer").Layer } */
    this.layer = layer
  }

  render() {
    for(let x=0; x<WIDTH; x++) {
      for(let y=0; y<HIEGHT; y++) {
        this.layer.set(x, y, CARPET_COLOR)
      }
    }
  }

}