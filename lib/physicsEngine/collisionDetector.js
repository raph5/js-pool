import { BALL_RADIUS, HIEGHT, WIDTH } from '../settings'
import { WallCollision } from './collision'


/**
 * Detect collision
 * @param {number} posX
 * @param {number} posY
 * @param {import('../assets/ball/index').default} ball
 */
export function detectCollision(posX, posY, ball) {

  /** @type { null | import('./collision').Collision } */
  let collision = null
  
  if(posX - BALL_RADIUS < 1) {
    collision = new WallCollision(ball, 0)
  }
  else if (posX + BALL_RADIUS > WIDTH + 1) {
    collision = new WallCollision(ball, 2)
  }

  if(posY - BALL_RADIUS < 1) {
    collision = new WallCollision(ball, 1)
  }
  else if(posY + BALL_RADIUS > HIEGHT + 1) {
    collision = new WallCollision(ball, 3)
  }
  
  return collision

}