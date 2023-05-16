import { BALL_RADIUS, HIEGHT, WIDTH } from "./settings"
import { rotationToQuaternion } from "./utils/quaternion"


/**
 * Return the updated prositions of a balls after a time period
 * @param {import("./assets/ball").default} ball
 * @param {number} deltaTime seconds
 */
function updateBallPos(ball, deltaTime) {

  const deltaPosX = ball.vx * deltaTime
  const deltaPosY = ball.vy * deltaTime
  let newPosX = ball.x + deltaPosX
  let newPosY = ball.y + deltaPosY
  let collisionOnX = false
  let collisionOnY = false

  
  if(newPosX - BALL_RADIUS < 1) {
    const _newPosX = BALL_RADIUS + 1
    newPosY = ball.y + deltaPosY*((newPosX-_newPosX)/deltaPosX)
    newPosX = _newPosX
    collisionOnX = true
  }
  else if (newPosX + BALL_RADIUS > WIDTH + 1) {
    const _newPosX = WIDTH - BALL_RADIUS + 1
    newPosY = ball.y + deltaPosY*((newPosX-_newPosX)/deltaPosX)
    newPosX = _newPosX
    collisionOnX = true
  }

  if(newPosY - BALL_RADIUS < 1) {
    const _newPosY = BALL_RADIUS + 1
    newPosX = ball.x + deltaPosX*((newPosY-_newPosY)/deltaPosY)
    newPosY = _newPosY
    collisionOnX = false
    collisionOnY = true
  }
  else if(newPosY + BALL_RADIUS > HIEGHT + 1) {
    const _newPosY = HIEGHT - BALL_RADIUS + 1
    newPosX = ball.x + deltaPosX*((newPosY-_newPosY)/deltaPosY)
    newPosY = _newPosY
    collisionOnX = false
    collisionOnY = true
  }

  const dx = newPosX - ball.x
  const dy = newPosY - ball.y

  // rotation
  const vx = ball.vx
  const vy = ball.vy
  const angle = Math.sqrt( dx**2 + dy**2 ) / BALL_RADIUS
  const quaternion = rotationToQuaternion(angle, -vx, vy, 0)
  ball.rotate(quaternion)

  // stoppage cases
  if(collisionOnX) {
    ball.vx = -ball.vx
    ball.x = newPosX
    ball.y = newPosY
    updateBallPos(ball, (1 - Math.abs(dx) / deltaPosX) * deltaTime)
  }
  if(collisionOnY) {
    ball.vy = -ball.vy
    ball.x = newPosX
    ball.y = newPosY
    updateBallPos(ball, (1 - Math.abs(dy) / deltaPosY) * deltaTime)
  }
  ball.x = newPosX
  ball.y = newPosY
  
}



/**
 * Return the updated prositions of all balls after a time period
 * @param {import("./assets/ball").default[]} balls
 * @param {number} deltaTime seconds
 */
export function updatePos(balls, deltaTime) {
  for(const ball of balls) {
    if(ball.vx != 0 || ball.vy != 0) {
      updateBallPos(ball, deltaTime)
    }
  }
}