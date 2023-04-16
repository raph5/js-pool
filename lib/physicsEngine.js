import { BALL_RADIUS, HIEGHT, WIDTH } from "./settings"



function getUpdatedPos(x, y, vx, vy, rx, ry, deltaTime) {

  const deltaPosX = vx * deltaTime
  const deltaPosY = vy * deltaTime
  let newPosX = x + deltaPosX
  let newPosY = y + deltaPosY
  let collisionOnX = false
  let collisionOnY = false


  if(newPosX - BALL_RADIUS < 1) {
    const _newPosX = BALL_RADIUS + 1
    newPosY = y + deltaPosY*((newPosX-_newPosX)/deltaPosX)
    newPosX = _newPosX
    collisionOnX = true
  }
  else if (newPosX + BALL_RADIUS > WIDTH + 1) {
    const _newPosX = WIDTH - BALL_RADIUS + 1
    newPosY = y + deltaPosY*((newPosX-_newPosX)/deltaPosX)
    newPosX = _newPosX
    collisionOnX = true
  }

  if(newPosY - BALL_RADIUS < 1) {
    const _newPosY = BALL_RADIUS + 1
    newPosX = x + deltaPosX*((newPosY-_newPosY)/deltaPosY)
    newPosY = _newPosY
    collisionOnX = false
    collisionOnY = true
  }
  else if(newPosY + BALL_RADIUS > HIEGHT + 1) {
    const _newPosY = HIEGHT - BALL_RADIUS + 1
    newPosX = x + deltaPosX*((newPosY-_newPosY)/deltaPosY)
    newPosY = _newPosY
    collisionOnX = false
    collisionOnY = true
  }


  // stoppage cases
  if(collisionOnX) {
    return getUpdatedPos(
      newPosX,
      newPosY,
      -vx,
      vy,
      rx,
      ry,
      (1 - Math.abs(x - newPosX) / deltaPosX) * deltaTime
    )
  }
  if(collisionOnY) {
    return getUpdatedPos(
      newPosX,
      newPosY,
      vx,
      -vy,
      rx,
      ry,
      (1 - Math.abs(y - newPosY) / deltaPosY) * deltaTime
    )
  }
  
  return [ newPosX, newPosY, vx, vy, rx, ry ]

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
    ball.rx = rx
    ball.ry = ry
  }
}