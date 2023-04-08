
/**
 * X, Y, Z
 * @typedef coordinate3D
 * @type {[number, number, number]}
 */

/**
 * Rotate a ball with a radius of 1
 * https://stackoverflow.com/questions/5278417/rotating-body-from-spherical-coordinates
 * @param {number} rx radian
 * @param {number} ry radian
 * @returns {coordinate3D}
 */
export function rotationToTopCoordinates(rx, ry) {
  const _x = Math.sin(ry)
  const _y = 0
  const _z = Math.cos(ry)

  const _cosRx = Math.cos(rx)
  const _sinRx = Math.sin(rx)
  const x = _x
  const y = _y*_cosRx - _z*_sinRx
  const z = _y*_sinRx + _z*_cosRx

  return [ x, y, z ]
}