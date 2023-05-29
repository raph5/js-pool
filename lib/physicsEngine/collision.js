
/**
 * WallCollision class
 * @param {import('../assets/ball/index').default} ball
 * @param {number} wallId
 * @param {number} advancement
 */
function WallCollision(ball, wallId, advancement) {
  this.type = 0
  this.ball = ball
  this.wallId = wallId
  this.advancement = advancement
}
WallCollision.type = 0


/**
 * BallCollision class
 * @param {import('../assets/ball/index').default} ball1
 * @param {import('../assets/ball/index').default} ball2
 * @param {number} advancement
 */
function BallCollision(ball1, ball2, advancement) {
  this.type = 1
  this.ball = ball1
  this.ball2 = ball2
  this.advancement = advancement
}
BallCollision.type = 1


/**
 * @typedef Collision
 * @type { WallCollision | BallCollision}
 */


export { WallCollision, BallCollision }