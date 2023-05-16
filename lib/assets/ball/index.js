import { Quaternion } from "../../utils/quaternion"
import * as renderer from "./renderer"


/** Ball */
export default class Ball {

  /**
   * @param { import("../../renderer").Layer } layer
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
    /** @type { import("../../renderer").Layer } */
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