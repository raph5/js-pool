
/**
 * change the momentum of the ball after a wall collision
 * @param {import('./collision').WallCollision} wallCollision
 */
export function handleWallCollision(wallCollision) {

  // left or right wall
  if(wallCollision.wallId === 0 || wallCollision.wallId === 2) {
    wallCollision.ball.vx = -wallCollision.ball.vx
  }

  // top or bottom wall
  if(wallCollision.wallId === 1 || wallCollision.wallId === 3) {
    wallCollision.ball.vy = -wallCollision.ball.vy
  }

}