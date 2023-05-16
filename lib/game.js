import Ball from './assets/ball/index'
import Carpet from './assets/carpet/index'
import { updatePos } from './physicsEngine/index'
import { Layer } from './renderer'

/**
 * Setup FPS monitor
 * @type {HTMLElement}
 */
// @ts-ignore
const fpsMonitor = document.getElementById('fps')
let fpsAvg
let fpsDelay = 0

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
    this.balls = [
      new Ball(ballsLayer, {
        x: 300,
        y: 250,
        vx: 200,
        vy: -300,
        strip: true,
        color: new Uint8ClampedArray([100, 10, 120])
      }),
      new Ball(ballsLayer, {
        x: 200,
        y: 250,
        vx: 0,
        vy: 0,
        strip: true,
        color: new Uint8ClampedArray([10, 10, 120])
      })
    ]

    this.renderer = renderer

    this.lastRender = Date.now()
  }

  render() {
    const time = Date.now()
    const deltaTime = (time - this.lastRender) / 1000
    this.lastRender = time
    updatePos(this.balls, deltaTime)
    
    for(const ball of this.balls) {
      ball.render()
    }
    
    this.renderer.render()

    if(fpsDelay > 15) {
      fpsAvg = fpsAvg ? (49*fpsAvg + 1/deltaTime) / 50 : 1/deltaTime
      fpsMonitor.innerText = `${Math.round(fpsAvg*100)/100} fps`
    }
    else {
      fpsDelay += 1
    }
  }
  
}