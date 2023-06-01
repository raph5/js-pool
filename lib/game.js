import Ball from './assets/ball/index'
import Carpet from './assets/carpet/index'
import { updatePos } from './physicsEngine/index'
import { Layer } from './renderer'
import { BALL_COLOR, BALL_RADIUS, BALL_WIDTH, GAME_SPEED, HIEGHT, WIDTH } from './settings'

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

    
    // setup balls
    const ballsLayer = new Layer(renderer)
    this.balls = []

    // place white balls
    this.balls.push(
      new Ball(ballsLayer, 0, {
        x: WIDTH - 250,
        y: HIEGHT / 2,
        vx: -200,
        vy: 1,
        strip: true,
        color: BALL_COLOR.white
      })
    )

    // place ball triangle
    for(let i=0; i<5; i++) {
      for(let j=i; j<5; j++) {
        this.balls.push(
          new Ball(ballsLayer, i*5+j+1, {
            x: 250 + i*BALL_WIDTH*0.88,
            y: HIEGHT/2 - BALL_WIDTH*2 + j*BALL_WIDTH*1.01 - i*BALL_RADIUS,
            vx: 0,
            vy: 0,
            strip: true,
            color: BALL_COLOR.red
          })
        )
      }
    }

    this.renderer = renderer

    this.lastRender = Date.now()
  }

  render() {

    // comput delta time between too frames
    const time = Date.now()
    const deltaTime = (time - this.lastRender) / 1000
    this.lastRender = time

    // update ball's possition
    updatePos(this.balls, 0.1 * GAME_SPEED)
    // TODO: updatePos(this.balls, deltaTime * GAME_SPEED)

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