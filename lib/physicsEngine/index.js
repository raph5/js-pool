import { CollisionStack } from "./collisionStack"
import { detectWallCollision, detectBallCollision, getFirstCollision } from "./collisionDetector"
import { testBallCollision, testWallCollision } from "./collisionTest"



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

  let adv = 0
  let collision

  // loop over collision stack
  while(true) {

    // get a collision to solve
    collision = getFirstCollision(balls, deltaTime - adv)

    // stop if no collision
    if(collision === null) break

    // forward balls
    for(const ball of balls) {
      ball.forward(collision.advancement)
    }

    // solve the collision
    collision.solve()

    adv += collision.advancement

  }

  if(collision) return
  
  for(const ball of balls) {
    ball.forward(deltaTime - adv)
    ball.updateRotation()
  }

}