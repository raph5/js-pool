

export const WIDTH = 1024
export const HIEGHT = 512

export const BALL_WIDTH = 60
export const BALL_RADIUS = BALL_WIDTH / 2
export const RAY_CASTING_RESOLUTION = 2

export const CARPET_COLOR = new Uint8ClampedArray([41, 89, 30, 255])


/**
 * Return index for coordonates
 * @param {number} x 
 * @param {number} y 
 * @returns {number}
 */
export const getGridIndex = (x, y) => x + (y << 10)