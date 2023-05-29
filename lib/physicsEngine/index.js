import { BALL_RADIUS } from "../settings"
import { rotationToQuaternion } from "../utils/quaternion"
import { detectWallCollision } from "./collisionDetector"
import { handleWallCollision } from "./collisionHandler"
import { wallCollisionRollback } from "./collisionRollback"



/**
 * Update prositions of all balls after a time period
 * @param {import("../assets/ball/index").default[]} balls
 * @param {number} deltaTime seconds
 */
export function updatePos(balls, deltaTime) {

  // the advancement describe how far a ball actually advanced to reatch it's sate at the next frame
  // this metric is expressed in milliseconds
  // advancement = 0           on frame n
  // advancement = deltaTime   on frame n+1

  // ballsAdvancement store all balls advanement
  // if a ball's advancement is neither equal to 0 nor equal to deltaTime, that mean that the ball
  // stoped because of a collision
  const ballsAdvancement = new Uint32Array(balls.length)

  // minAdvancement is the advancement of less advanced ball
  // when minAdvancement = deltaTime that mean that the state of all balls are updated to reatch the
  // next frame
  let minAdvancement = 0

  let wallCollision

  while(minAdvancement !== deltaTime) {

    // loop over balls
    for(let i=0; i<balls.length; i++) {

      // skip a ball it's state is updated
      if(ballsAdvancement[i] === deltaTime) {
        continue
      }

      // if a ball is not mooving, mark it's advancement as updated
      if(balls[i].vx === 0 && balls[i].vy === 0) {
        ballsAdvancement[i] = deltaTime
        continue
      }
      
      wallCollision = updateBallPos(balls[i], deltaTime)

      

    }
    
  }

}



/**
 * Forward the ball until a collision happens
 * If wall collision, update the ball's momentum and call back the function recursively
 * @param {import("../assets/ball/index").default} ball
 * @param {number} deltaTime seconds
 * @returns {null|import("./collision").Collision}
 */
function updateBallPos(ball, deltaTime) {

  // detect wall collision
  const wallCollision = detectWallCollision(ball, deltaTime)
  
  if(wallCollision) {
    ball.x = ball.x + ball.vx * wallCollision.advancement
    ball.y = ball.y + ball.vy * wallCollision.advancement
  }
  else {
    ball.x = ball.x + ball.vx * deltaTime
    ball.y = ball.y + ball.vy * deltaTime
  }

  return wallCollision

  // TODO: reemplement rotation
  
  // update ball rotation
  // const angle = Math.sqrt( (ball.x - oldPosX)**2 + (ball.y - oldPosY)**2 ) / BALL_RADIUS
  // const quaternion = rotationToQuaternion(angle, -ball.vx, ball.vy, 0)
  // ball.rotate(quaternion)
  
}