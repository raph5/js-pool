import { coordinates2D, coordinates3D, rgb, rgba } from "../types"
import { Layer } from "../renderer"
import { mixRgbColors } from "../colors"
import { BALL_RADIUS, BALL_WIDTH, RAY_CASTING_RESOLUTION } from "../settings"


const CIRCLE_MATRIX = new Array<Array<boolean>>(BALL_WIDTH*RAY_CASTING_RESOLUTION)
const INTERSECTION_MATRIX = new Array<Array<coordinates3D>>(BALL_WIDTH*RAY_CASTING_RESOLUTION)


// CIRCLE_MATRIX and INTERSECTION_MATRIX setup
{
  const _width = BALL_WIDTH*RAY_CASTING_RESOLUTION
  const _center = (_width) / 2
  for(let x=0; x<_width; x++) {
    CIRCLE_MATRIX[x] = new Array<boolean>(_width)
    INTERSECTION_MATRIX[x] = new Array<coordinates3D>(_width)
    for(let y=0; y<_width; y++) {
      const distanceToCenter = Math.sqrt( (x+0.5 - _center)**2 + (y+0.5 - _center)**2 )
      const isInCircle = distanceToCenter < _center

      CIRCLE_MATRIX[x][y] = isInCircle

      if(isInCircle) {

        const _x: f32 = f32((x+0.5 - _center) / _center)
        const _y: f32 = f32((y+0.5 - _center) / _center)
        const _z: f32 = f32(Math.sqrt( 1 - (distanceToCenter / _center)**2 ))
        INTERSECTION_MATRIX[x][y] = [ _x, _y, _z ]

      }
    }
  }
}


// Rotate a ball with a radius of 1
// https://stackoverflow.com/questions/5278417/rotating-body-from-spherical-coordinates
function rotationToCoordinates(rx: f32, ry: f32): Array<coordinates3D> {
  const _cosRy: f32 = f32(Math.cos(ry))
  const topX: f32 = f32(Math.sin(ry))
  const topY: f32 = f32(-_cosRy*Math.sin(rx))
  const topZ: f32 = f32(_cosRy*Math.cos(rx))

  const leftX: f32 = 0
  const leftY: f32 = f32(Math.sin(rx + Math.PI/2))
  const leftZ: f32 = f32(Math.cos(-rx + Math.PI/2))

  return [ [topX, topY, topZ], [leftX, leftY, leftZ] ]
}


// Ball
export default class Ball {

  
  private lastRender: coordinates2D = [-1, -1]
  
  constructor(
    private layer: Layer,
    public x: i16,
    public y: i16,
    public rx: f32,
    public ry: f32,
    public vx: f32,
    public vy: f32,
    public strip: boolean,
    public color: rgb
  ) {}
  
  render(): void {
    
    // Cleaning
    if( (this.x != this.lastRender[0] || this.y != this.lastRender[1]) && this.lastRender[0] != -1 ) {
      for(let x:i16=0; x<BALL_WIDTH; x++) {
        for(let y:i16=0; y<BALL_WIDTH; y++) {
          this.layer.set(this.lastRender[0] + x, this.lastRender[1] + y, [ 0, 0, 0, 0 ])
        }
      }
    }
    this.lastRender = [ this.x, this.y ]
    
    
    for(let _x:i16=0; _x<BALL_WIDTH; _x++) {
      for(let _y:i16=0; _y<BALL_WIDTH; _y++) {
        
        // Ray Casting
        const raysColor = new Array<rgb>(RAY_CASTING_RESOLUTION)
        let _a: i8 = 0

        for(let rayX:i16=0; rayX<RAY_CASTING_RESOLUTION; rayX++) {
          for(let rayY:i16=0; rayY<RAY_CASTING_RESOLUTION; rayY++) {
            const isInCircle = CIRCLE_MATRIX[_x*RAY_CASTING_RESOLUTION + rayX][_y*RAY_CASTING_RESOLUTION + rayY]
            if(isInCircle) {
              
              // comput the spherical coordinates of the intersection of the ray and the sphere
              const rayCoordinates = INTERSECTION_MATRIX[_x*RAY_CASTING_RESOLUTION + rayX][_y*RAY_CASTING_RESOLUTION + rayY]
              const coordinates = rotationToCoordinates(this.rx, this.ry)
              
              const distanceToTop: f32 = f32(Math.sqrt(
                (rayCoordinates[0] - coordinates[0][0])**2 + 
                (rayCoordinates[1] - coordinates[0][1])**2 + 
                (rayCoordinates[2] - coordinates[0][2])**2
              ))
              
              if(distanceToTop < 0.4) {
                raysColor[rayX+rayY*RAY_CASTING_RESOLUTION] = [ 255, 255, 255 ] as rgb
              }
              else if(this.strip) {
                const distanceToLeft = Math.sqrt( (rayCoordinates[0] - coordinates[1][0])**2 + (rayCoordinates[1] - coordinates[1][1])**2 + (rayCoordinates[2] - coordinates[1][2])**2 )
                if(distanceToLeft < 0.8 || distanceToLeft > 1.81) {
                  raysColor[rayX+rayY*RAY_CASTING_RESOLUTION] = [ 255, 255, 255 ]
                }
                else {
                  raysColor[rayX+rayY*RAY_CASTING_RESOLUTION] = this.color
                }
              }
              else {
                raysColor[rayX+rayY*RAY_CASTING_RESOLUTION] = this.color
              }
              
            }
            else {
              _a++
            }
          }
        }
        
        
        const a: u8 = u8( 255 * (raysColor.length ? 1 - _a / RAY_CASTING_RESOLUTION**2 : 0) )
        const c: rgb = raysColor.length ? mixRgbColors(raysColor) : [ 0, 0, 0 ]
        
        const x: i16 = u16(this.x - BALL_RADIUS) + _x
        const y: i16 = u16(this.y - BALL_RADIUS) + _y
        
        this.layer.set(x, y, [ c[0], c[1], c[2], a ])
        
      }
    }
    
  }

}