import { BALL_RADIUS, BALL_WIDTH, HIEGHT, WIDTH } from '../settings'
import { BallCollision, WallCollision } from './collision'


/**
 * Test wall collision
 * @param {import('../assets/ball/index').default} ball
 * @param {number} posX
 * @param {number} posY
 */
export function testWallCollision(ball, posX, posY) {

  // stop if ball is not moving
  if(ball.vx === 0 && ball.vy === 0) {
    return null
  }

  /** @type { null | import('./collision').Collision } */
  let collision = null

  if(posX - BALL_RADIUS < 0) {
    // comput collision timing
    const t = -(ball.x - BALL_RADIUS) / ball.vx
    // create collision objcets
    collision = new WallCollision(ball, 0, t)
  }
  else if (posX + BALL_RADIUS > WIDTH) {
    const t = (WIDTH - ball.x - BALL_RADIUS) / ball.vx
    collision = new WallCollision(ball, 2, t)
  }
  
  if(posY - BALL_RADIUS < 0) {
    const t = -(ball.y - BALL_RADIUS) / ball.vy
    if(!collision || collision.advancement > t) {
      collision = new WallCollision(ball, 1, t)
    }
  }
  else if(posY + BALL_RADIUS > HIEGHT) {
    const t = (HIEGHT - ball.y - BALL_RADIUS) / ball.vy
    if(!collision || collision.advancement > t) {
      collision = new WallCollision(ball, 3, t)
    }
  }
  
  return collision

}



const BALL_WIDTH_SQUARED = BALL_WIDTH**2


/**
 * Test ball collision
 * @param {import('../assets/ball/index').default} iBall
 * @param {number} iPosX
 * @param {number} iPosY
 * @param {import('../assets/ball/index').default} jBall
 * @param {number} jPosX
 * @param {number} jPosY
 */
export function testBallCollision(iBall, iPosX, iPosY, jBall, jPosX, jPosY) {

  // stop if two balls are not moving
  if(iBall.vx === 0 && iBall.vy === 0 && jBall.vx === 0 && jBall.vy === 0) {
    return null
  }

  // first filter
  if(Math.abs(iPosX - jPosX) <= BALL_WIDTH) {
    if(Math.abs(iPosY - jPosY) <= BALL_WIDTH) {

      
      // compute distance between the too balls
      const dist = (iPosX - jPosX)**2 + (iPosY - jPosY)**2
      
      if(dist < BALL_WIDTH_SQUARED) {

        // comput collision timing
        let t

        const xDelta = iBall.x - jBall.x
        const yDelta = iBall.y - jBall.y
        const vxDelta = iBall.vx - jBall.vx
        const vyDelta = iBall.vy - jBall.vy

        const a = vxDelta**2 + vyDelta**2
        const b = 2 * (xDelta*vxDelta + yDelta*vyDelta)
        const c = xDelta**2 + yDelta**2 - BALL_WIDTH_SQUARED

        t = (-Math.sqrt( b**2 - 4*a*c ) - b) / (2*a)

        // create new collision
        return new BallCollision(iBall, jBall, t)

      }
    }
  }

  return null

}