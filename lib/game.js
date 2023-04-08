import Ball from './assets/ball'
import Carpet from './assets/carpet'
import { Layer } from './renderer'

/** Manage game display */
export class Game {

  /**
   * @param { import('./renderer').Renderer } renderer
   */
  constructor(renderer) {
    // build the carpet
    const carpetLayer = new Layer(renderer)
    const carpet = new Carpet(carpetLayer)
    carpet.render()

    // place a ball at the center
    const ballsLayer = new Layer(renderer)
    this.ball = new Ball(ballsLayer, { x:50, y:50, strip: true, color: { r:100, g:10, b:120, a:255 } })

    this.renderer = renderer
  }

  render() {
    this.ball.render()
    this.renderer.render()
  }

}