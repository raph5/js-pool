import { mixRgbColors } from "./colors"
import { rotationToTopCoordinates } from "./utils"

const BALL_WIDTH = 100
const RAY_CASTING_RESOLUTION = 2
/** @type {boolean[][]} */
const CIRCLE_MATRIX = []
/** @type {(import("./utils").coordinate3D|null)[][]} */
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


/** Ball */
export default class Ball {

  /**
   * @param { import("./renderer").Layer } layer
   * @param {object} option
   * @param {number} [option.x]
   * @param {number} [option.y]
   * @param {number} [option.rx]
   * @param {number} [option.ry]
   * @param {boolean} [option.strip]
   * @param { import('./renderer').Rgba } [option.color]
   */
  constructor(layer, option={}) {
    /** @type { import("./renderer").Layer } */
    this.layer = layer
    /** @type {number} */
    this.x = option.x ?? 0
    /** @type {number} */
    this.y = option.y ?? 0
    /** @type {number} */
    this.rx = option.rx ?? 0
    /** @type {number} */
    this.ry = option.ry ?? 0
    /** @type {boolean} */
    this.strip = option.strip ?? false
    /** @type { import('./renderer').Rgba } */
    this.color = option.color ?? { r:0, g:0, b:0, a:255 }
  }

  render() {
    for(let _x=0; _x<BALL_WIDTH; _x++) {
      for(let _y=0; _y<BALL_WIDTH; _y++) {
        
        // Ray Casting
        const raysColor = []
        let _a = 0

        for(let rayX=0; rayX<RAY_CASTING_RESOLUTION; rayX++) {
          for(let rayY=0; rayY<RAY_CASTING_RESOLUTION; rayY++) {
            const isInCircle = CIRCLE_MATRIX[_x*RAY_CASTING_RESOLUTION + rayX][_y*RAY_CASTING_RESOLUTION + rayY]
            if(isInCircle) {
              
              // comput the spherical coordinates of the intersection of the ray and the sphere
              /** @type {import("./utils").coordinate3D} */
              // @ts-ignore
              const rayCoordinates = INTERSECTION_MATRIX[_x*RAY_CASTING_RESOLUTION + rayX][_y*RAY_CASTING_RESOLUTION + rayY]
              const topCoordinates = rotationToTopCoordinates(this.rx, this.ry)

              const distanceToTop = Math.sqrt( (rayCoordinates[0] - topCoordinates[0])**2 + (rayCoordinates[1] - topCoordinates[1])**2 + (rayCoordinates[2] - topCoordinates[2])**2 )

              if(distanceToTop < 0.4) {
                raysColor.push({ r:255, g:255, b:255, a:255 })
              }
              // else if(this.strip && distanceToTop > 1.3 && distanceToTop < 1.6) {
              //   raysColor.push({ r:255, g:255, b:255, a:255 })
              // }
              else {
                raysColor.push(this.color)
              }

            }
            else {
              _a++
            }
          }
        }

        const a = 255 * (raysColor.length ? 1 - _a / RAY_CASTING_RESOLUTION**2 : 0)
        const { r, g, b } = raysColor.length ? mixRgbColors(raysColor) : { r:0, g:0, b:0 }

        this.layer.set(
          this.x + _x,
          this.y + _y,
          { r, g, b, a }
        )

      }
    }
  }

}