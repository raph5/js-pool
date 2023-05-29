import { BALL_RADIUS, BALL_WIDTH, HIEGHT, WIDTH } from '../settings'
import { WallCollision } from './collision'


/**
 * Detect wall collision
 * @param {import('../assets/ball/index').default} ball
 * @param {number} deltaTime
 */
export function detectWallCollision(ball, deltaTime) {

  /** @type { null | import('./collision').Collision } */
  let collision = null

  const deltaX = ball.vx * deltaTime
  const deltaY = ball.vx * deltaTime
  const posX = ball.x + deltaX
  const posY = ball.y + deltaY
  
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



/**
 * Take the array of all balls
 * Return the array of ball collisions
 * @param {import('../assets/ball/index').default[]} balls 
 * @param {number} deltaTime 
 */
export function detectBallsCollision(balls, deltaTime) {

  const collisions = []

  // loop over all ball combinations
  for(let i=0; i<balls.length; i++) {
    for(let j=i+1; j<balls.length; j++) {

      // first filter
      if(Math.abs(balls[i].x - balls[j].x) <= BALL_WIDTH) {
        if(Math.abs(balls[i].y - balls[j].y) <= BALL_WIDTH) {

          // compute distance between the too balls
          const dist = Math.sqrt( (balls[i].x - balls[j].x)**2 - (balls[i].y - balls[j].y)**2 )

          if(dist)

        }
      }

    }
  }

}