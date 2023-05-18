
/**
 * WallCollision class
 * @param {import('../assets/ball/index').default} ball
 * @param {number} wallId
 */
function WallCollision(ball, wallId) {
  this.type = 0
  this.ball = ball
  this.wallId = wallId
}
WallCollision.type = 0


/**
 * BallCollision class
 * @param {import('../assets/ball/index').default} ball1
 * @param {import('../assets/ball/index').default} ball2
 */
function BallCollision(ball1, ball2) {
  this.type = 1
  this.ball = ball1
  this.ball2 = ball2
}
BallCollision.type = 1


/**
 * @typedef Collision
 * @type { WallCollision | BallCollision}
 */


export { WallCollision, BallCollision }