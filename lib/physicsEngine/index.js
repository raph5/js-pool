import { BALL_RADIUS } from "../settings"
import { rotationToQuaternion } from "../utils/quaternion"
import { detectCollision } from "./collisionDetector"
import { handleCollision } from "./collisionHandler"
import { rollbackAtCollision } from "./collisionRollback"


/**
 * Forward the ball until a collision happens
 * If collision, update the ball's momentum and call back the function recursively
 * @param {import("../assets/ball/index").default} ball
 * @param {number} deltaTime seconds
 */
function updateBallPos(ball, deltaTime) {

  // store initial ball position
  const oldPosX = ball.x
  const oldPosY = ball.y

  // forward the ball
  ball.x = ball.x + ball.vx * deltaTime
  ball.y = ball.y + ball.vy * deltaTime

  // detect collision
  const collision = detectCollision(ball.x, ball.y, ball)

  // if no collision, update ball rotation and return
  if(!collision) {

    // update ball rotation
    const angle = Math.sqrt( (ball.x - oldPosX)**2 + (ball.y - oldPosY)**2 ) / BALL_RADIUS
    const quaternion = rotationToQuaternion(angle, -ball.vx, ball.vy, 0)
    ball.rotate(quaternion)

    return
  }

  // rollback at collision
  rollbackAtCollision(oldPosX, oldPosY, collision)

  // handle collision
  handleCollision(collision)

  // update ball rotation
  const angle = Math.sqrt( (ball.x - oldPosX)**2 + (ball.y - oldPosY)**2 ) / BALL_RADIUS
  const quaternion = rotationToQuaternion(angle, -ball.vx, ball.vy, 0)
  ball.rotate(quaternion)
  
  // call one again the function with a smaller deltaTime
  const newDeltaTime = (1 - Math.abs(ball.x - oldPosX) / ball.vx * deltaTime) * deltaTime
  updateBallPos(ball, newDeltaTime)
  
}



/**
 * Return the updated prositions of all balls after a time period
 * @param {import("../assets/ball/index").default[]} balls
 * @param {number} deltaTime seconds
 */
export function updatePos(balls, deltaTime) {
  for(const ball of balls) {
    if(ball.vx != 0 || ball.vy != 0) {
      updateBallPos(ball, deltaTime)
    }
  }
}