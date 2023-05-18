import { BALL_RADIUS, HIEGHT, WIDTH } from '../settings'
import { WallCollision } from './collision'


/**
 * Rollback at collision
 * @param {number} oldPosX
 * @param {number} oldPosY
 * @param {import('./collision').Collision} collision
 */
export function rollbackAtCollision(oldPosX, oldPosY, collision) {

  // in the case of a wall collision
  if(collision.type === WallCollision.type) {
    // @ts-ignore
    return wallCollisionRollback(oldPosX, oldPosY, collision)
  }

}


/**
 * Rollback at wall collision
 * @param {number} oldPosX
 * @param {number} oldPosY
 * @param {import('./collision').WallCollision} wallCollision
 */
function wallCollisionRollback(oldPosX, oldPosY, wallCollision) {

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