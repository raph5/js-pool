
const BALL_WIDTH = 17
const CIRCLE_MATRIX = [
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
]

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
    // console.log(this.layer.data[750])
    for(let _x=0; _x<BALL_WIDTH; _x++) {
      for(let _y=0; _y<BALL_WIDTH; _y++) {
        if(CIRCLE_MATRIX[_x][_y]) {
          this.layer.set(
            this.x + _x,
            this.y + _y,
            this.color
          )
        }
      }
    }
  }

}