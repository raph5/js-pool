import { CARPET_COLOR, HIEGHT, WIDTH } from '../settings'

export default class Carpet {

  /**
   * @param { import("../renderer").Layer } layer 
   */
  constructor(layer) {
    /** @type { import("../renderer").Layer } */
    this.layer = layer
  }

  render() {
    const dataLength = (WIDTH*HIEGHT) << 2
    for(let i=0; i<dataLength; i+=4) {
      this.layer.data[i] = CARPET_COLOR[0]
      this.layer.data[i+1] = CARPET_COLOR[1]
      this.layer.data[i+2] = CARPET_COLOR[2]
      this.layer.data[i+3] = CARPET_COLOR[3]
    }
  }

}