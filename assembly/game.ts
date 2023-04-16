import { Renderer } from './renderer'
import Ball from './assets/ball'
import Carpet from './assets/carpet'
import { updatePos } from './physicsEngine'
import { Layer } from './renderer'
import { pixelMap } from './types'


// Manage game display
export class Game {

  private balls: Array<Ball>
  private lastRender: i64 = Date.now()

  constructor(
    public renderer: Renderer
  ) {
    // build the carpet
    const carpetLayer = new Layer(renderer, 0)
    const carpet = new Carpet(carpetLayer)
    carpet.render()

    // place a ball at the center
    const ballsLayer = new Layer(renderer, 1)
    this.balls = [
      new Ball(ballsLayer, 100, 150, -50, -100, 0.3, 0, true, [100, 10, 120])
    ]
  }

  render(): pixelMap {
    const time: i64 = Date.now()
    const deltaTime = (time - this.lastRender) / 1000
    this.lastRender = time
    updatePos(this.balls, deltaTime)
    
    for(let i=0; i<this.balls.length; i++) {
      this.balls[i].render()
    }
    
    return this.renderer.render()
  }
  
}