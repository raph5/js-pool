import { Quaternion } from "../../utils/quaternion"
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
   * @param {Quaternion} [option.quat]
   * @param {boolean} [option.strip]
   * @param { Uint8ClampedArray } [option.color]
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
    if(option.quat) {
      topCo = option.quat.rotatePoint(topCo)
      leftCo = option.quat.rotatePoint(leftCo)
    }

    this.topCo = topCo
    this.leftCo = leftCo
  }
  
  render() {
    renderer.render(this)
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