import { mixRgbColors } from "../colors"
import { BALL_RADIUS, BALL_WIDTH, RAY_CASTING_RESOLUTION, WIDTH, getGridIndex } from "../settings"
import { Quaternion } from "../utils/quaternion"

/**
 * X, Y, Z
 * @typedef coordinate3D
 * @type {[number, number, number]}
 */


// const
const _halfPi = Math.PI/2


/** @type {number[][]} */
const ALPHA_MATRIX = []
/** @type {boolean[][]} */
const CIRCLE_MATRIX = []
/** @type {(coordinate3D|null)[][]} */
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

            const _x = (RAY_CASTING_RESOLUTION*x+rayX+0.5 - _center) / _center
            const _y = (RAY_CASTING_RESOLUTION*y+rayY+0.5 - _center) / _center
            const _z = Math.sqrt( 1 - (distanceToCenter / _center)**2 )
            INTERSECTION_MATRIX[RAY_CASTING_RESOLUTION*x+rayX].push([ _x, _y, _z ])
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



/** Ball */
export default class Ball {

  /**
   * @param { import("../renderer").Layer } layer
   * @param {object} option
   * @param {number} [option.x]
   * @param {number} [option.y]
   * @param {number} [option.vx]
   * @param {number} [option.vy]
   * @param {Quaternion} [option.quat]
   * @param {boolean} [option.strip]
   * @param { Uint8ClampedArray } [option.color]
   */
  constructor(layer, option={}) {
    /** @type { import("../renderer").Layer } */
    this.layer = layer
    /** @type {number} */
    this.x = option.x ?? 0
    /** @type {number} */
    this.y = option.y ?? 0
    /** @type {number} */
    this.vx = option.vx ?? 0
    /** @type {number} */
    this.vy = option.vy ?? 0
    /** @type {boolean} */
    this.strip = option.strip ?? false
    /** @type { Uint8ClampedArray } */
    this.color = option.color ?? new Uint8ClampedArray([0, 0, 0, 255])

    /** @type {number} */
    this.lastRenderIndex = 0

    // store coordonates of top and left point of the ball
    let topCo = new Float32Array(3)
    topCo[0] = 0
    topCo[1] = 0
    topCo[2] = 1
    let leftCo = new Float32Array(3)
    leftCo[0] = 0
    leftCo[1] = 1
    leftCo[2] = 0

    // if initial rotation, rotate this points
    if(option.quat) {
      topCo = option.quat.rotatePoint(topCo)
      leftCo = option.quat.rotatePoint(leftCo)
    }

    /** @type {Float32Array} */
    this.topCo = topCo
    /** @type {Float32Array} */
    this.leftCo = leftCo
  }
  
  render() {

    const _rayCastingResSquared = RAY_CASTING_RESOLUTION**2
    const _v1 = (WIDTH - BALL_WIDTH) << 2
    
    // Cleaning
    let pixelIndex = this.lastRenderIndex

    for(let x=0; x<BALL_WIDTH; x++) {
      for(let y=0; y<BALL_WIDTH; y++) {
        if(ALPHA_MATRIX[x][y] != 0) {
          this.layer.data[pixelIndex] = 0
          this.layer.data[pixelIndex+1] = 0
          this.layer.data[pixelIndex+2] = 0
          this.layer.data[pixelIndex+3] = 0
        }
        pixelIndex += 4
      }
      pixelIndex += _v1
    }


    pixelIndex = getGridIndex(this.x - BALL_RADIUS, this.y - BALL_RADIUS) << 2
    this.lastRenderIndex = pixelIndex

    
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
                /** @type {coordinate3D} */
                // @ts-ignore
                const rayCo = INTERSECTION_MATRIX[x*RAY_CASTING_RESOLUTION + rayX][y*RAY_CASTING_RESOLUTION + rayY]
  
                const distanceToTop = (rayCo[0] - this.topCo[0])**2 + (rayCo[1] - this.topCo[1])**2 + (rayCo[2] - this.topCo[2])**2
                
                if(distanceToTop < 0.16) {
                  whiteRay++
                }
                else if(this.strip) {
                  const distanceToLeft = (rayCo[0] - this.leftCo[0])**2 + (rayCo[1] - this.leftCo[1])**2 + (rayCo[2] - this.leftCo[2])**2
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
          this.layer.data[pixelIndex] = (255 * whiteRay + this.color[0] * primaryColorRay) / _rayCastingResSquared
          this.layer.data[pixelIndex+1] = (255 * whiteRay + this.color[1] * primaryColorRay) / _rayCastingResSquared
          this.layer.data[pixelIndex+2] = (255 * whiteRay + this.color[2] * primaryColorRay) / _rayCastingResSquared
          this.layer.data[pixelIndex+3] = ALPHA_MATRIX[x][y]
        }
        
        pixelIndex += 4
      }
      pixelIndex += _v1
    }
    
  }

  /**
   * Rotate the ball along a quaternion
   * @param {Quaternion} quat 
   */
  rotate(quat) {
    this.topCo = quat.rotatePoint(this.topCo)
    this.leftCo = quat.rotatePoint(this.leftCo)
  }

}