import { BALL_RADIUS, FRICTION_COEFF, MIN_SPEED } from "../../settings"
import { Rotation } from "../../utils/rotation"
import * as renderer from "./renderer"


/** Ball */
export default class Ball {

  /**
   * @param { import("../../renderer").Layer } layer
   * @param {number} ballId
   * @param {object} option
   * @param {number} [option.x]
   * @param {number} [option.y]
   * @param {number} [option.vx]
   * @param {number} [option.vy]
   * @param {Rotation} [option.rotation]
   * @param {boolean} [option.strip]
   * @param {Uint8ClampedArray} [option.color]
   */
  constructor(layer, ballId, option={}) {

    // block the create of more than 256 balls
    if(ballId > 255) {
      throw new Error("Too many balls created. Max is 256 balls")
    }

    this.id = ballId

    this.layer = layer
    this.x = option.x ?? 0
    this.y = option.y ?? 0
    this.vx = option.vx ?? 0
    this.vy = option.vy ?? 0
    this.strip = option.strip ?? false
    this.color = option.color ?? new Uint8ClampedArray([0, 0, 0, 255])

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
    if(option.rotation) {
      option.rotation.apply(topCo)
      option.rotation.apply(leftCo)
    }

    this.topCo = topCo
    this.leftCo = leftCo

    this.rotationBufferAngle = 0
    this.rotationBufferVx = 0
    this.rotationBufferVy = 0
  }
  
  /**
   * Render the ball on the layer
   * @param {boolean} [forceRender] 
   */
  render(forceRender=false) {
    // dont render if balls are not moving
    if(this.vx !== 0 && this.vy !== 0 || forceRender) {
      renderer.render(this)
    }
  }

  /**
   * Apply rotation in rotation buffer
   */
  updateRotation() {
    // apply rotation
    let rotation
    if(this.rotationBufferVx === 0 && this.rotationBufferVx === 0) {
      rotation = new Rotation( this.rotationBufferAngle, 1, 0, 0 )
    }
    else {
      rotation = new Rotation( this.rotationBufferAngle, this.rotationBufferVx, this.rotationBufferVy, 0 )
    }
    rotation.apply(this.topCo)
    rotation.apply(this.leftCo)

    // reset rotation angle
    this.rotationBufferAngle = 0
  }

  /**
   * Forward ball position and rotation in time
   * @param {number} deltaTime 
   */
  forward(deltaTime) {

    // comput delta vx and vy to handle deceleration due to friction
    this.vx += -this.vx * FRICTION_COEFF * deltaTime
    this.vy += -this.vy * FRICTION_COEFF * deltaTime

    // stop ball if it's speed in under MIN_SPEED
    if(Math.abs(this.vx) < MIN_SPEED && Math.abs(this.vy) < MIN_SPEED) {
      this.vx = 0
      this.vy = 0
    }

    const deltaX = this.vx * deltaTime
    const deltaY = this.vy * deltaTime
    const deltaAngle = Math.sqrt( deltaX**2 + deltaY**2 ) / BALL_RADIUS * Math.sign(deltaTime)

    // update ball position
    this.x += deltaX
    this.y += deltaY

    // update ball rotation
    if(this.vx === this.rotationBufferVx && -this.vy === this.rotationBufferVy) {
      // if rotation angle iis the same, simply increase rotation angle
      this.rotationBufferAngle += deltaAngle
    }
    else {
      // else, apply rotation in rotation buffer
      this.updateRotation()

      // setup new rotation buffer
      this.rotationBufferAngle = deltaAngle
      this.rotationBufferVx = -this.vx
      this.rotationBufferVy = this.vy
    }
  }

}