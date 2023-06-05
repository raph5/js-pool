import { FRICTION_COEFF, MIN_SPEED } from '../settings'
import { testBallCollision, testWallCollision } from './collisionTest'


/**
 * Detect wall collision and add it to collision stack
 * @param {import('../assets/ball/ball').default} ball
 * @param {import('./collisionStack').CollisionStack} collisionStack
 * @param {number} deltaTime
 * @param {number} startTime
 */
export function detectWallCollision(ball, collisionStack, deltaTime, startTime) {

  // stop if ball is not moving
  if(ball.vx === 0 && ball.vy === 0) {
    return
  }

  // comput forward position
  const posX = ball.x + ball.vx * deltaTime
  const posY = ball.y + ball.vy * deltaTime

  // test collision
  const collision = testWallCollision(ball, posX, posY)

  // add it to collision stack
  if(collision !== null) {
    collision.advancement += startTime
    collisionStack.add(collision)
  }

}



/**
 * Detect wall collision and add it to collision stack
 * @param {import('../assets/ball/ball').default} ball1
 * @param {import('../assets/ball/ball').default} ball2
 * @param {import('./collisionStack').CollisionStack} collisionStack
 * @param {number} deltaTime
 * @param {number} startTime
 */
export function detectBallCollision(ball1, ball2, collisionStack, deltaTime, startTime) {

  // comput forward position
  const pos1X = ball1.x + ball1.vx * deltaTime
  const pos1Y = ball1.y + ball1.vy * deltaTime
  const pos2X = ball2.x + ball2.vx * deltaTime
  const pos2Y = ball2.y + ball2.vy * deltaTime

  // test collision
  const collision = testBallCollision(ball1, pos1X, pos1Y, ball2, pos2X, pos2Y)

  // add it to collision stack
  if(collision !== null) {
    collision.advancement += startTime
    collisionStack.add(collision)
  }

}




/**
 * get the first collision
 * @param {import('../assets/ball/ball').default[]} balls
 * @param {number} deltaTime
 */
export function getFirstCollision(balls, deltaTime) {

  /** @type {null | import('./collision').Collision} */
  let firstCollision = null
  let collision
  
  // populate collision stack with wall collisions
  for(let i=0; i<balls.length; i++) {

    // comput delta vx and vy to handle deceleration due to friction
    let iVx = balls[i].vx - balls[i].vx * FRICTION_COEFF * deltaTime
    let iVy = balls[i].vy - balls[i].vy * FRICTION_COEFF * deltaTime

    // stop ball if it's speed in under MIN_SPEED
    if(Math.abs(iVx) < MIN_SPEED && Math.abs(iVy) < MIN_SPEED) {
      iVx = 0
      iVy = 0
    }
  
    // comput forward position
    const iPosX = balls[i].x + iVx * deltaTime
    const iPosY = balls[i].y + iVy * deltaTime
    
    // test collision
    collision = testWallCollision(balls[i], iPosX, iPosY)
  
    // test if is first collision
    if(collision !== null && collision.advancement < deltaTime && (firstCollision === null || collision.advancement < firstCollision.advancement)) {
      firstCollision = collision
    }
  
    for(let j=i+1; j<balls.length; j++) {

      // comput delta vx and vy to handle deceleration due to friction
      let jVx = balls[j].vx - balls[j].vx * FRICTION_COEFF * deltaTime
      let jVy = balls[j].vy - balls[j].vy * FRICTION_COEFF * deltaTime
  
      // stop ball if it's speed in under MIN_SPEED
      if(Math.abs(jVx) < MIN_SPEED && Math.abs(jVy) < MIN_SPEED) {
        jVx = 0
        jVy = 0
      }
  
      const jPosX = balls[j].x + jVx * deltaTime
      const jPosY = balls[j].y + jVy * deltaTime
      
      collision = testBallCollision(balls[i], iPosX, iPosY, balls[j], jPosX, jPosY)
  
      if(collision !== null && collision.advancement < deltaTime && (firstCollision === null || collision.advancement < firstCollision.advancement)) {
        firstCollision = collision
      }
    }
  }

  return firstCollision

}

