import { mixRgbColors } from "../colors"
import { BALL_RADIUS, BALL_WIDTH, RAY_CASTING_RESOLUTION, WIDTH, getGridIndex } from "../settings"

/**
 * X, Y, Z
 * @typedef coordinate3D
 * @type {[number, number, number]}
 */


/** @type {boolean[][]} */
const CIRCLE_MATRIX = []
/** @type {(coordinate3D|null)[][]} */
const INTERSECTION_MATRIX = []

// CIRCLE_MATRIX and INTERSECTION_MATRIX setup
{
  const _width = BALL_WIDTH * RAY_CASTING_RESOLUTION
  const _center = (_width) / 2
  for(let x=0; x<_width; x++) {
    CIRCLE_MATRIX.push([])
    INTERSECTION_MATRIX.push([])
    for(let y=0; y<_width; y++) {
      const distanceToCenter = Math.sqrt( (x+0.5 - _center)**2 + (y+0.5 - _center)**2 )
      const isInCircle = distanceToCenter < _center

      CIRCLE_MATRIX[x].push(isInCircle)

      if(isInCircle) {

        const _x = (x+0.5 - _center) / _center
        const _y = (y+0.5 - _center) / _center
        const _z = Math.sqrt( 1 - (distanceToCenter / _center)**2 )
        INTERSECTION_MATRIX[x].push([ _x, _y, _z ])

      }
      else {
        INTERSECTION_MATRIX[x].push(null)
      }
    }
  }
}

/**
 * Rotate a ball with a radius of 1
 * https://stackoverflow.com/questions/5278417/rotating-body-from-spherical-coordinates
 * @param {number} rx radian
 * @param {number} ry radian
 */
function rotationToCoordinates(rx, ry) {
  const _cosRy = Math.cos(ry)
  const topX = Math.sin(ry)
  const topY = -_cosRy*Math.sin(rx)
  const topZ = _cosRy*Math.cos(rx)

  const leftX = 0
  const leftY = Math.sin(rx + Math.PI/2)
  const leftZ = Math.cos(-rx + Math.PI/2)

  return { top: [topX, topY, topZ], left: [leftX, leftY, leftZ] }
}



/** Ball */
export default class Ball {

  /**
   * @param { import("../renderer").Layer } layer
   * @param {object} option
   * @param {number} [option.x]
   * @param {number} [option.y]
   * @param {number} [option.rx]
   * @param {number} [option.ry]
   * @param {number} [option.vx]
   * @param {number} [option.vy]
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
    this.rx = option.rx ?? 0
    /** @type {number} */
    this.ry = option.ry ?? 0
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
  }
  
  render() {

    const _rayCastingResSquared = RAY_CASTING_RESOLUTION**2
    const _v1 = (WIDTH - BALL_WIDTH) << 2
    
    // Cleaning
    let pixelIndex = this.lastRenderIndex

    for(let x=0; x<BALL_WIDTH; x++) {
      for(let y=0; y<BALL_WIDTH; y++) {
        this.layer.data[pixelIndex] = 0
        this.layer.data[pixelIndex+1] = 0
        this.layer.data[pixelIndex+2] = 0
        this.layer.data[pixelIndex+3] = 0

        pixelIndex += 4
      }
      pixelIndex += _v1
    }


    pixelIndex = getGridIndex(this.x - BALL_RADIUS, this.y - BALL_RADIUS) << 2
    this.lastRenderIndex = pixelIndex

    
    for(let _x=0; _x<BALL_WIDTH; _x++) {
      for(let _y=0; _y<BALL_WIDTH; _y++) {
        
        // Ray Casting
        let primaryColorRay = 0
        let whiteRay = 0
        let alphaRay = 0

        for(let rayX=0; rayX<RAY_CASTING_RESOLUTION; rayX++) {
          for(let rayY=0; rayY<RAY_CASTING_RESOLUTION; rayY++) {
            const isInCircle = CIRCLE_MATRIX[_x*RAY_CASTING_RESOLUTION + rayX][_y*RAY_CASTING_RESOLUTION + rayY]
            if(isInCircle) {
              
              // comput the spherical coordinates of the intersection of the ray and the sphere
              /** @type {coordinate3D} */
              // @ts-ignore
              const rayCoordinates = INTERSECTION_MATRIX[_x*RAY_CASTING_RESOLUTION + rayX][_y*RAY_CASTING_RESOLUTION + rayY]
              const { top: topCoordinates, left: leftCoordinates } = rotationToCoordinates(this.rx, this.ry)
              
              const distanceToTop = Math.sqrt( (rayCoordinates[0] - topCoordinates[0])**2 + (rayCoordinates[1] - topCoordinates[1])**2 + (rayCoordinates[2] - topCoordinates[2])**2 )
              
              if(distanceToTop < 0.4) {
                whiteRay++
              }
              else if(this.strip) {
                const distanceToLeft = Math.sqrt( (rayCoordinates[0] - leftCoordinates[0])**2 + (rayCoordinates[1] - leftCoordinates[1])**2 + (rayCoordinates[2] - leftCoordinates[2])**2 )
                if(distanceToLeft < 0.8 || distanceToLeft > 1.81) {
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
            else {
              alphaRay++
            }
          }
        }
        
        
        // color placing
        this.layer.data[pixelIndex] = (255 * whiteRay + this.color[0] * primaryColorRay) / _rayCastingResSquared
        this.layer.data[pixelIndex+1] = (255 * whiteRay + this.color[1] * primaryColorRay) / _rayCastingResSquared
        this.layer.data[pixelIndex+2] = (255 * whiteRay + this.color[2] * primaryColorRay) / _rayCastingResSquared
        this.layer.data[pixelIndex+3] = 255 * (1 - alphaRay / _rayCastingResSquared)
        
        pixelIndex += 4
      }
      pixelIndex += _v1
    }
    
  }

}