import { BALL_WIDTH, ELASTICITY_COEFF } from '../settings'

/**
 * WallCollision class
 */
class WallCollision {

  static type = 0

  /**
   * @param {import('../assets/ball/index').default} ball
   * @param {number} wallId
   * @param {number} advancement
   */
  constructor(ball, wallId, advancement) {
    this.type = 0
    this.balls = [ ball ]
    this.wallId = wallId
    this.advancement = advancement
  }

  /**
   * solve the first collision of the stack by changing it's mementum
   */
  solve() {

    // left or right wall
    if(this.wallId === 0 || this.wallId === 2) {
      this.balls[0].vx = -this.balls[0].vx
    }

    // top or bottom wall
    if(this.wallId === 1 || this.wallId === 3) {
      this.balls[0].vy = -this.balls[0].vy
    }
  }
  
}


/**
 * BallCollision class
 */
class BallCollision {

  static type = 1

  /**
   * @param {import('../assets/ball/index').default} ball1
   * @param {import('../assets/ball/index').default} ball2
   * @param {number} advancement
   */
  constructor(ball1, ball2, advancement) {
    this.type = 1
    this.balls = [ ball1, ball2 ]
    this.advancement = advancement
  }

  /**
   * solve the first collision of the stack by changing it's mementum
   */
  solve() {
    
    const dx = this.balls[1].x - this.balls[0].x
    const dy = this.balls[1].y - this.balls[0].y
    const dist = Math.sqrt(dx * dx + dy * dy)

    const nx = dx / dist
    const ny = dy / dist

    const dvx = this.balls[1].vx - this.balls[0].vx
    const dvy = this.balls[1].vy - this.balls[0].vy

    const impulse = (dvx * nx + dvy * ny) * ELASTICITY_COEFF

    const impulseX = impulse * nx
    const impulseY = impulse * ny

    this.balls[0].vx += impulseX
    this.balls[0].vy += impulseY
    this.balls[1].vx -= impulseX
    this.balls[1].vy -= impulseY
  }
  
}


/**
 * @typedef Collision
 * @type { WallCollision | BallCollision}
 */


export { WallCollision, BallCollision }