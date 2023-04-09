
// TODO: refactorer le moteur de physique


import { BALL_RADIUS, HIEGHT, WIDTH } from "./settings"


function testCollision(x, y, vx, vy, getOverflow, getCollisionValue) {
  const overflow = getOverflow(x, y)
  if(overflow > 0) {
    return getCollisionValue(overflow, vx, vy)
  }
  return null
}


const CONSTRAINTS = [
  {
    getOverflow: (x, y) => (BALL_RADIUS - x),
    getCollisionValue: (overflow, vx, vy) => [overflow, vy/vx * -overflow, 'x'],
  },
  {
    getOverflow: (x, y) => (x + BALL_RADIUS - WIDTH),
    getCollisionValue: (overflow, vx, vy) => [-overflow, vy/vx * -overflow, 'x'],
  },
  {
    getOverflow: (x, y) => (BALL_RADIUS - y),
    getCollisionValue: (overflow, vx, vy) => [vx/vy * -overflow, overflow, 'y'],
  },
  {
    getOverflow: (x, y) => (y + BALL_RADIUS - HIEGHT),
    getCollisionValue: (overflow, vx, vy) => [vx/vy * -overflow, -overflow, 'y'],
  }
]
function getUpdatedPos(x, y, vx, vy, rx, ry, deltaTime) {

  const deltaPosX = vx * deltaTime
  const deltaPosY = vy * deltaTime
  const newPosX = x + deltaPosX
  const newPosY = y + deltaPosY

  // comput collisions
  let collision
  let minCollisionsX = Infinity

  for(const constraint of CONSTRAINTS) {
    const col = testCollision(newPosX, newPosY, vx, vy, constraint.getOverflow, constraint.getCollisionValue)
    
    if(col) {
      if(col[0] < minCollisionsX) {
        collision = col
      }
    }
  }

  // stoppage cases
  if(collision) {
    const newDeltaTime = Math.abs(collision[0] / deltaPosX) * deltaTime

    if(collision[2] == 'x') {
      return getUpdatedPos(
        newPosX + collision[0],
        newPosY + collision[1],
        -vx,
        vy,
        rx,
        ry,
        newDeltaTime
      )
    }
    return getUpdatedPos(
      newPosX + collision[0],
      newPosY + collision[1],
      vx,
      -vy,
      rx,
      ry,
      newDeltaTime
    )
  }
  
  return [ newPosX, newPosY, vx, vy ]

}


/**
 * Return the updated prositions of all balls after a time period
 * @param {import("./assets/ball").default[]} balls
 * @param {number} deltaTime seconds
 */
export function updatePos(balls, deltaTime) {
  for(const ball of balls) {
    const [ x, y, vx, vy, rx, ry ] = getUpdatedPos(ball.x, ball.y, ball.vx, ball.vy, ball.rx, ball.ry, deltaTime)
    ball.x = x
    ball.y = y
    ball.vx = vx
    ball.vy = vy
  }
}