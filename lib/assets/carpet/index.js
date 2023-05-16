import * as renderer from "./renderer"


/**
 * Carpet asset class
 */
export default class Carpet {

  /**
   * @param { import("../../renderer").Layer } layer 
   */
  constructor(layer) {
    /** @type { import("../../renderer").Layer } */
    this.layer = layer
  }

  render() {
    renderer.render(this)
  }

}