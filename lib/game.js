import Ball from './assets/ball/index'
import Carpet from './assets/carpet/index'
import { updatePos } from './physicsEngine/index'
import { Layer } from './renderer'
import { BALL_RADIUS, GAME_SPEED } from './settings'

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
      new Ball(ballsLayer, 0, {
        x: 300,
        y: 250,
        vx: 100,
        vy: -150,
        strip: true,
        color: new Uint8ClampedArray([100, 10, 120])
      }),
      new Ball(ballsLayer, 1, {
        x: 400,
        y: 100,
        vx: 10,
        vy: 0,
        strip: true,
        color: new Uint8ClampedArray([10, 10, 120])
      })
    ]

    this.renderer = renderer

    this.lastRender = Date.now()
  }

  render() {

    // comput delta time between too frames
    const time = Date.now()
    const deltaTime = (time - this.lastRender) / 1000
    this.lastRender = time

    // update ball's possition
    updatePos(this.balls, deltaTime * GAME_SPEED)

    // render all the balls to the ball's layer
    for(const ball of this.balls) {
      ball.render()
    }
    
    // render all the layers too the canvas
    this.renderer.render()

    // update fps monitor
    if(fpsDelay > 15) {
      fpsAvg = fpsAvg ? (49*fpsAvg + 1/deltaTime) / 50 : 1/deltaTime
      fpsMonitor.innerText = `${Math.round(fpsAvg*100)/100} fps`
    }
    else {
      fpsDelay += 1
    }

  }
  
}