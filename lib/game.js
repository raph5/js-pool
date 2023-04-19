import Ball from './assets/ball'
import Carpet from './assets/carpet'
import { updatePos } from './physicsEngine'
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
    this.balls = [ new Ball(ballsLayer, { x:100, y:150, vx: -100, vy: -200, rx: 0.3, strip: true, color: new Uint8ClampedArray([100, 10, 120]) }) ]

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
      fpsAvg = fpsAvg ? (99*fpsAvg + 1/deltaTime) / 100 : 1/deltaTime
      fpsMonitor.innerText = `${Math.round(fpsAvg*100)/100} fps`
    }
    else {
      fpsDelay += 1
    }
  }
  
}