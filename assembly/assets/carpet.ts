import { Layer } from '../renderer'
import { CARPET_COLOR, HIEGHT, WIDTH } from '../settings'

export default class Carpet {

  constructor(
    private layer: Layer
  ) {}

  render(): void {
    for(let x:i16=0; x<WIDTH; x++) {
      for(let y:i16=0; y<HIEGHT; y++) {
        this.layer.set(x, y, CARPET_COLOR)
      }
    }
  }

}