import { Layer } from './renderer'
import { CARPET_COLOR } from './settings'

/** Manage game display */
export default class Game {

  /**
   * @param { import('./renderer').Renderer } renderer
   */
  constructor(renderer) {
    // build the carpet
    const carpet = new Layer(CARPET_COLOR)
    renderer.layers.push(carpet)
  }

}