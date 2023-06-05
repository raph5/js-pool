import Ball from './assets/ball/ball'
import Carpet from './assets/carpet/carpet'
import Stick from './assets/stick/stick'
import { updatePos } from './physicsEngine/index'
import { Layer } from './renderer'
import { BALL_COLOR, BALL_RADIUS, BALL_WIDTH, GAME_SPEED, HEIGHT, MAX_STICK_SETBACKS, STICK_STRENGTH, WIDTH } from './settings'
import { GameEvents } from './utils/events'
import { shuffle } from './utils/utils'


const BALLS = [
  [ 'yellow', true ],
  [ 'orange', true ],
  [ 'red', true ],
  [ 'darkRed', true ],
  [ 'green', true ],
  [ 'blue', true ],
  [ 'darkBlue', true ],
  [ 'yellow', false ],
  [ 'orange', false ],
  [ 'red', false ],
  [ 'darkRed', false ],
  [ 'green', false ],
  [ 'blue', false ],
  [ 'darkBlue', false ]
]

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
   * @param { import('./canvas').default } canvas
   */
  constructor(renderer, canvas) {
    // build the carpet
    const carpetLayer = new Layer()
    const carpet = new Carpet(carpetLayer)
    carpet.render()
    
    // setup balls
    const ballsLayer = new Layer()
    this.balls = []

    // place white balls
    this.balls.push(
      new Ball(ballsLayer, 0, {
        x: WIDTH - 250,
        y: HEIGHT / 2,
        vx: 0,
        vy: 0,
        strip: true,
        color: BALL_COLOR.white
      })
    )
    this.balls[0].render(true)

    // shuffle the balls
    const shuffledBalls = shuffle(BALLS)

    // place ball triangle
    let id = 0
    for(let i=0; i<5; i++) {
      for(let j=i; j<5; j++) {
        const randomX = Math.random()*0.75 - 0.5
        const randomY = Math.random()*0.75 - 0.5

        // choose the color
        let color, strip
        if(id === 10) {
          color = 'black'
          strip = false
        }
        else if(id > 10) {
          color = shuffledBalls[id-1][0]
          strip = shuffledBalls[id-1][1]
        }
        else {
          color = shuffledBalls[id][0]
          strip = shuffledBalls[id][1]
        }

        this.balls.push(
          new Ball(ballsLayer, id, {
            x: 250 + i*BALL_WIDTH*0.9 + randomX,
            y: HEIGHT/2 - BALL_WIDTH*2 + j*BALL_WIDTH*1.05 - i*BALL_RADIUS + randomY,
            vx: 0,
            vy: 0,
            strip: strip,
            color: BALL_COLOR[color]
          })
        )

        this.balls[this.balls.length-1].render(true)

        id++
      }
    }

    // setup stick
    const stickLayer = new Layer()
    this.stick = new Stick(stickLayer, this.balls[0], canvas)
    this.stick.render()

    this.canvas = canvas
    this.renderer = renderer
    this.renderer.layers = [ carpetLayer, ballsLayer, stickLayer ]
    this.lastRender = Date.now()

    // gameLoop only
    this.state = 0

    // subscribe to events
    GameEvents.subscribe('whiteballstrike', (vx, vy) => {
      // pitch ball
      this.balls[0].vx = vx
      this.balls[0].vy = vy
      this.state = 1
    })

    GameEvents.subscribe('ballsarestoped', () => {
      this.state = 0
    })
  }

  render() {

    // comput delta time between too frames
    const time = Date.now()
    const deltaTime = (time - this.lastRender) / 1000
    this.lastRender = time

    // update all game elements
    this.gameLoop(deltaTime)
    
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

  /**
   * Update all game elements
   * @param {number} deltaTime 
   */
  gameLoop(deltaTime) {

    // check if balls are stoped
    if(this.state === 1) {
      let ballsAreStoped = true

      for(const ball of this.balls) {
        if(ball.vx !== 0 || ball.vy !== 0) {
          ballsAreStoped = false
          break
        }
      }

      if(ballsAreStoped) {
        GameEvents.emit('ballsarestoped')
      }
    }

    // update balls and stick possition
    updatePos(this.balls, deltaTime * GAME_SPEED)
    this.stick.update(deltaTime)
    
    // render all the balls to the ball's layer
    for(const ball of this.balls) {
      ball.render()
    }
    
    // render stick
    this.stick.render()
    
  }

}