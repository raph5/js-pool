import { BALL_RADIUS, BALL_WIDTH, RAY_CASTING_RESOLUTION, WIDTH, getGridIndex } from "../../settings"


/** @type {number[][]} */
const ALPHA_MATRIX = []
/** @type {boolean[][]} */
const CIRCLE_MATRIX = []
/** @type {(Float32Array|null)[][]} */
const INTERSECTION_MATRIX = []

// ALPHA_MATRIX, CIRCLE_MATRIX and INTERSECTION_MATRIX setup
{
  const _center = (BALL_WIDTH * RAY_CASTING_RESOLUTION) / 2
  
  for(let x=0; x<BALL_WIDTH; x++) {
    ALPHA_MATRIX.push([])
    for(let i=0; i<RAY_CASTING_RESOLUTION; i++) {
      CIRCLE_MATRIX.push([])
      INTERSECTION_MATRIX.push([])
    }

    for(let y=0; y<BALL_WIDTH; y++) {
      let alpha = 0

      for(let rayX=0; rayX<RAY_CASTING_RESOLUTION; rayX++) {
        for(let rayY=0; rayY<RAY_CASTING_RESOLUTION; rayY++) {
          const distanceToCenter = Math.sqrt( (RAY_CASTING_RESOLUTION*x+rayX+0.5 - _center)**2 + (RAY_CASTING_RESOLUTION*y+rayY+0.5 - _center)**2 )
          const isInCircle = distanceToCenter < _center

          CIRCLE_MATRIX[RAY_CASTING_RESOLUTION*x+rayX].push(isInCircle)
          
          if(isInCircle) {
            alpha++

            const coordinates = new Float32Array(3)
            coordinates[0] = (RAY_CASTING_RESOLUTION*x+rayX+0.5 - _center) / _center
            coordinates[1] = (RAY_CASTING_RESOLUTION*y+rayY+0.5 - _center) / _center
            coordinates[2] = Math.sqrt( 1 - (distanceToCenter / _center)**2 )
            INTERSECTION_MATRIX[RAY_CASTING_RESOLUTION*x+rayX].push(coordinates)
          }
          else {
            INTERSECTION_MATRIX[RAY_CASTING_RESOLUTION*x+rayX].push(null)
          }
        }
      }

      ALPHA_MATRIX[x].push(255 * alpha / RAY_CASTING_RESOLUTION**2)
    }
  }
}


const _rayCastingResSquared = RAY_CASTING_RESOLUTION**2
const _v1 = (WIDTH - BALL_WIDTH) << 2

/**
 * render the ball on layer
 * @param {import('./index').default} ball
 */
export function render(ball) {
  
  // Cleaning
  let pixelIndex = ball.lastRenderIndex

  for(let x=0; x<BALL_WIDTH; x++) {
    for(let y=0; y<BALL_WIDTH; y++) {
      if(ALPHA_MATRIX[x][y] != 0) {
        ball.layer.data[pixelIndex] = 0
        ball.layer.data[pixelIndex+1] = 0
        ball.layer.data[pixelIndex+2] = 0
        ball.layer.data[pixelIndex+3] = 0
      }
      pixelIndex += 4
    }
    pixelIndex += _v1
  }

  pixelIndex = getGridIndex(ball.x - BALL_RADIUS, ball.y - BALL_RADIUS) << 2
  ball.lastRenderIndex = pixelIndex

  
  for(let x=0; x<BALL_WIDTH; x++) {
    for(let y=0; y<BALL_WIDTH; y++) {
      if(ALPHA_MATRIX[x][y] != 0) {

        // Ray Casting
        let primaryColorRay = 0
        let whiteRay = 0

        for(let rayX=0; rayX<RAY_CASTING_RESOLUTION; rayX++) {
          for(let rayY=0; rayY<RAY_CASTING_RESOLUTION; rayY++) {
            const isInCircle = CIRCLE_MATRIX[x*RAY_CASTING_RESOLUTION + rayX][y*RAY_CASTING_RESOLUTION + rayY]
            if(isInCircle) {
              
              // comput the spherical coordinates of the intersection of the ray and the sphere
              /** @type {Float32Array} */
              // @ts-ignore
              const rayCo = INTERSECTION_MATRIX[x*RAY_CASTING_RESOLUTION + rayX][y*RAY_CASTING_RESOLUTION + rayY]

              const distanceToTop = (rayCo[0] - ball.topCo[0])**2 + (rayCo[1] - ball.topCo[1])**2 + (rayCo[2] - ball.topCo[2])**2

              if(distanceToTop < 0.16) {
                whiteRay++
              }
              else if(ball.strip) {
                const distanceToLeft = (rayCo[0] - ball.leftCo[0])**2 + (rayCo[1] - ball.leftCo[1])**2 + (rayCo[2] - ball.leftCo[2])**2
                if(distanceToLeft < 0.64 || distanceToLeft > 3.2761) {
                  whiteRay++
                }
                else {
                  primaryColorRay++
                }
              }
              else {
                primaryColorRay++
              }
              
            }
          }
        }

        // color placing
        ball.layer.data[pixelIndex] = (225 * whiteRay + ball.color[0] * primaryColorRay) / _rayCastingResSquared
        ball.layer.data[pixelIndex+1] = (225 * whiteRay + ball.color[1] * primaryColorRay) / _rayCastingResSquared
        ball.layer.data[pixelIndex+2] = (225 * whiteRay + ball.color[2] * primaryColorRay) / _rayCastingResSquared
        ball.layer.data[pixelIndex+3] = ALPHA_MATRIX[x][y]
      }
      
      pixelIndex += 4
    }
    pixelIndex += _v1
  }
  
}