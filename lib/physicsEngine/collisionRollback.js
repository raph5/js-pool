import { BALL_RADIUS, HIEGHT, WIDTH } from '../settings'


/**
 * Rollback at wall collision
 * @param {import('./collision').WallCollision} wallCollision
 * @param {number} oldPosX
 * @param {number} oldPosY
 */
export function wallCollisionRollback(wallCollision, oldPosX, oldPosY) {

  const vxToVyFactor = Math.abs(wallCollision.ball.vy / wallCollision.ball.vx)
  
  // left wall
  if(wallCollision.wallId === 0) {
    wallCollision.ball.x = BALL_RADIUS + 1
    wallCollision.ball.y = oldPosY + (wallCollision.ball.x - oldPosX) * vxToVyFactor
  }
  // right wall
  else if (wallCollision.wallId === 2) {
    wallCollision.ball.x = WIDTH - BALL_RADIUS + 1
    wallCollision.ball.y = oldPosY + (wallCollision.ball.x - oldPosX) * vxToVyFactor
  }
  // top wall
  else if(wallCollision.wallId === 1) {
    wallCollision.ball.y = BALL_RADIUS + 1
    wallCollision.ball.x = oldPosX + (wallCollision.ball.y - oldPosY) / vxToVyFactor
  }
  // bottom wall
  else if(wallCollision.wallId === 3) {
    wallCollision.ball.y = HIEGHT - BALL_RADIUS + 1
    wallCollision.ball.x = oldPosX + (wallCollision.ball.y - oldPosY) / vxToVyFactor
  }

}