

export const WIDTH = 1024
export const HIEGHT = 512

export const BALL_WIDTH = 40
export const BALL_RADIUS = BALL_WIDTH / 2
export const RAY_CASTING_RESOLUTION = 2
export const ELASTICITY_COEFF = 0.92
export const FRICTION_COEFF = 0.001

export const CARPET_COLOR = new Uint8ClampedArray([41, 89, 30, 255])

export const GAME_SPEED = 1

export const BALL_COLOR = {
  white: new Uint8ClampedArray([225, 225, 225]),
  black: new Uint8ClampedArray([100, 10, 120]),
  yellow: new Uint8ClampedArray([100, 10, 120]),
  orange: new Uint8ClampedArray([100, 10, 120]),
  red: new Uint8ClampedArray([100, 10, 120]),
  drakRed: new Uint8ClampedArray([100, 10, 120]),
  green: new Uint8ClampedArray([100, 10, 120]),
  blue: new Uint8ClampedArray([100, 10, 120]),
  darkBlue: new Uint8ClampedArray([100, 10, 120]),
}


/**
 * Return index for coordonates
 * @param {number} x 
 * @param {number} y 
 * @returns {number}
 */
export const getGridIndex = (x, y) => x + (y << 10)