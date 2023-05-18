import { WallCollision } from './collision'


/**
 * change the momentum of the ball after a wall collision
 * @param {import('./collision').WallCollision} wallCollision
 */
function handleWallCollision(wallCollision) {

  // left or right wall
  if(wallCollision.wallId === 0 || wallCollision.wallId === 2) {
    wallCollision.ball.vx = -wallCollision.ball.vx
  }

  // top or bottom wall
  if(wallCollision.wallId === 1 || wallCollision.wallId === 3) {
    wallCollision.ball.vy = -wallCollision.ball.vy
  }

}


/**
 * change the momentum of the ball after a collision
 * @param {import('./collision').Collision} collision 
 */
export function handleCollision(collision) {

  // handle the collision with the appropriate function
  if(collision.type === WallCollision.type) {
    // @ts-ignore
    handleWallCollision(collision)
  }

}