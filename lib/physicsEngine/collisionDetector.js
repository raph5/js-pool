import { testBallCollision, testWallCollision } from './collisionTest'


/**
 * Detect wall collision and add it to collision stack
 * @param {import('../assets/ball/index').default} ball
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
 * @param {import('../assets/ball/index').default} ball1
 * @param {import('../assets/ball/index').default} ball2
 * @param {import('./collisionStack').CollisionStack} collisionStack
 * @param {number} deltaTime
 * @param {number} startTime
 */
export function detectBallCollision(ball1, ball2, collisionStack, deltaTime, startTime) {

  // stop if two balls are not moving
  if(ball1.vx === 0 && ball1.vy === 0 && ball2.vx === 0 && ball2.vy === 0) {
    return
  }

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