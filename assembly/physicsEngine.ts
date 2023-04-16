import Ball from "./assets/ball"
import { BALL_RADIUS, HIEGHT, WIDTH } from "./settings"



function getUpdatedPos(x: f32, y: f32, vx: f32, vy: f32, rx: f32, ry: f32, deltaTime: f32): Array<f32> {  // return : x, y, vx, vy, rx, ry

  const deltaPosX: f32 = vx * deltaTime
  const deltaPosY: f32 = vy * deltaTime
  let newPosX: f32 = x + deltaPosX
  let newPosY: f32 = y + deltaPosY
  let collisionOnX = false
  let collisionOnY = false


  if(newPosX - BALL_RADIUS < 1) {
    const _newPosX: f32 = f32(BALL_RADIUS + 1)
    newPosY = y + deltaPosY*((newPosX-_newPosX)/deltaPosX)
    newPosX = _newPosX
    collisionOnX = true
  }
  else if (newPosX + BALL_RADIUS > WIDTH + 1) {
    const _newPosX: f32 = f32(WIDTH - BALL_RADIUS + 1)
    newPosY = y + deltaPosY*((newPosX-_newPosX)/deltaPosX)
    newPosX = _newPosX
    collisionOnX = true
  }

  if(newPosY - BALL_RADIUS < 1) {
    const _newPosY: f32 = f32(BALL_RADIUS + 1)
    newPosX = x + deltaPosX*((newPosY-_newPosY)/deltaPosY)
    newPosY = _newPosY
    collisionOnX = false
    collisionOnY = true
  }
  else if(newPosY + BALL_RADIUS > HIEGHT + 1) {
    const _newPosY: f32 = f32(HIEGHT - BALL_RADIUS + 1)
    newPosX = x + deltaPosX*((newPosY-_newPosY)/deltaPosY)
    newPosY = _newPosY
    collisionOnX = false
    collisionOnY = true
  }

  // TODO: calculer la rotation de la balle

  if(collisionOnX) {
    return getUpdatedPos(
      newPosX,
      newPosY,
      -vx,
      vy,
      rx,
      ry,
      f32((1 - Math.abs(x - newPosX) / deltaPosX) * deltaTime)
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
      f32((1 - Math.abs(y - newPosY) / deltaPosY) * deltaTime)
    )
  }

  return [ newPosX, newPosY, vx, vy, rx, ry ]

}



// Return the updated prositions of all balls after a time period
export function updatePos(balls: Ball[], deltaTime: i64): void {
  for(let i=0; i<balls.length; i++) {
    const pos = getUpdatedPos(balls[i].x, balls[i].y, balls[i].vx, balls[i].vy, balls[i].rx, balls[i].ry, f32(deltaTime))
    balls[i].x = i16(pos[0])
    balls[i].y = i16(pos[1])
    balls[i].vx = pos[2]
    balls[i].vy = pos[3]
    balls[i].rx = pos[4]
    balls[i].ry = pos[5]
  }
}