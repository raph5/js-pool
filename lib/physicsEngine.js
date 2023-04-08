import { BALL_RADIUS, HIEGHT, WIDTH } from "./settings"

/**
 * The ball's position (the x and y values mark the center of the ball)
 * @typedef BallPos
 * @type {object}
 * @property {number} x px (position)
 * @property {number} y px (position)
 * @property {number} vx px/s (momentom)
 * @property {number} vy px/s (momentom)
 * 
 * @typedef Collisions
 * @type {[ 'L'|'R'|'T'|'B', [number, number] ]}
 */



function testCollision(condition)


function updatePos(x, y, vx, vy, deltaTime) {

  const deltaPosX = vx * deltaTime
  const deltaPosY = vy * deltaTime
  const newPosX = x + deltaPosX
  const newPosY = y + deltaPosY


  // comput collisions
  /** @type {Set.<Collisions>} */
  const collisionsSet = new Set()
  let minCollisionDistX = Infinity

  /** @type {Collisions} */
  let collision

  switch (true) {
    case (x-BALL_RADIUS < 1) :
      collision = [
        'L',
        [ x-BALL_RADIUS+1, (x-BALL_RADIUS+1) * vy/vx ]
      ]
      collisionsSet.add(collision)
      if(collision[1][0] < minCollisionDistX) { minCollisionDistX = collision[1][0] }

    case (x+BALL_RADIUS > WIDTH) :
      collision = [
        'R',
        [ x+BALL_RADIUS-WIDTH, (x+BALL_RADIUS-WIDTH) * vy/vx ]
      ]
      collisionsSet.add(collision)
      if(collision[1][0] < minCollisionDistX) { minCollisionDistX = collision[1][0] }

    case (y-BALL_RADIUS < 1) :
      collisionsSet.add([
        'T',
        [y-BALL_RADIUS]
      ])
      if((y-BALL_RADIUS) * vx/vy < minCollisionDistX) { minCollisionDistX = (y-BALL_RADIUS) * vx/vy }

    case (y+BALL_RADIUS > HIEGHT) :
      collisionsSet.add([
        'B',
        [y+BALL_RADIUS]
      ])
      if((y+BALL_RADIUS) * vx/vy < minCollisionDistX) { minCollisionDistX = (y+BALL_RADIUS) * vx/vy }
  }

  const collisions = []

  if(collisionsSet.size > 1) {
    for(const c of collisionsSet) {
      if(c[0] == 'L' || c[0] == 'R') {
        if(c[1] == minCollisionDistX) {
          collisions.unshift(c)
        }
      }
      else {
        if(c[1] * vx/vy == minCollisionDistX) {
          collisions.push(c)
        }
      }
    }
  }
  else {
    collisions.push( collisionsSet.entries().next() )
  }


  if(collisions.length == 0) {
    return [ newPosX, newPosY, vx, vy ]
  }

  if(collisions.length == 1) {

  }

  if(collisions.length == 2) {
    return updatePos(
      newPosX - collisions[0][1],
      newPosY - collisions[1][1],
      vy, // invert momentoms
      vx
    )
  }
  
}


/**
 * Return the updated prositions of all balls after a time period
 * @param {BallPos[]} balls
 * @param {number} deltaTime seconds
 * @returns {BallPos[]}
 */
export function getUpdatedPos(balls, deltaTime) {
  for(let i=0; i<balls.length; i++) {
    balls[i] = updatePos(balls[i].x, balls[i].y, balls[i].vx, balls[i].vy, deltaTime)
  }
}