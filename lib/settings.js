import { hexToColor } from "./utils/utils"


export const WIDTH = 1024
export const HEIGHT = 512
export const PADDING_TOP = 50
export const PADDING_LEFT = 100

export const BALL_WIDTH = 32
export const BALL_RADIUS = BALL_WIDTH / 2
export const RAY_CASTING_RESOLUTION = 2
export const ELASTICITY_COEFF = 0.92
export const FRICTION_COEFF = 0.5
export const MIN_SPEED = 4

export const STICK_LENGTH = 350
export const STICK_COLOR = new Uint8ClampedArray([100, 50, 20])
export const STICK_POINT_COLOR = new Uint8ClampedArray([50, 30, 30])
export const STICK_STRENGTH = 14
export const MAX_STICK_SETBACKS = 50

export const CARPET_COLOR = new Uint8ClampedArray([41, 89, 30, 255])

export const GAME_SPEED = 1

export const BALL_COLOR = {
  white: hexToColor(0xe1e1e1),
  black: hexToColor(0x111111),
  yellow: hexToColor(0xdbc309),
  orange: hexToColor(0xdb620b),
  red: hexToColor(0xdb0b0b),
  darkRed: hexToColor(0x910606),
  green: hexToColor(0x1b7d13),
  blue: hexToColor(0x071fd9),
  darkBlue: hexToColor(0x34068a),
}


/**
 * Return index for coordonates
 * @param {number} x 
 * @param {number} y 
 * @returns {number}
 */
export const getGridIndex = (x, y) => x + (y << 10)