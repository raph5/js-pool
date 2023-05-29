import { CollisionStack } from "./collisionStack"
import { detectWallCollision, detectBallCollision } from "./collisionDetector"



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

  const collisionStack = new CollisionStack()

  // populate collision stack with wall collisions
  for(let i=0; i<balls.length; i++) {
    detectWallCollision(balls[i], collisionStack, deltaTime, 0)

    for(let j=i+1; j<balls.length; j++) {
      detectBallCollision(balls[i], balls[j], collisionStack, deltaTime, 0)
    }
  }

  /** @type {number} */
  let collisionAdv
  let adv = 0

  // loop over collision stack
  while(!collisionStack.isEmpty()) {

    // @ts-ignore
    collisionAdv = collisionStack.topNode.collision.advancement

    // forward balls
    for(const ball of balls) {
      ball.forward(collisionAdv - adv)
    }

    // register updated balls to test their collision later
    // @ts-ignore
    const updatedBalls = collisionStack.topNode.collision.balls

    // solve a collision
    collisionStack.solveCollision()
    
    // test new collisions
    const _balls = [ ...updatedBalls ]
    for(let i=0; i<balls.length; i++) {
      if(!updatedBalls.includes(balls[i])) {
        _balls.push(balls[i])
      }
    }
    for(let i=0; i<updatedBalls.length; i++) {
      detectWallCollision(_balls[i], collisionStack, deltaTime - adv, collisionAdv)
  
      for(let j=i+1; j<balls.length; j++) {
        detectBallCollision(_balls[i], _balls[j], collisionStack, deltaTime - adv, collisionAdv)
      }
    }
    
    adv = collisionAdv
  }
  
  for(const ball of balls) {
    ball.forward(deltaTime - adv)
    ball.updateRotation()
  }

}