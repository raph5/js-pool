import * as renderer from "./renderer"


/**
 * Carpet asset class
 */
export default class Carpet {

  /**
   * @param { import("../../renderer").Layer } layer 
   */
  constructor(layer) {
    this.layer = layer
  }

  render() {
    renderer.render(this)
  }

}