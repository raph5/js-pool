/**
 * Additive Color Mixing
 * https://stackoverflow.com/questions/28900598/how-to-combine-two-colors-with-varying-alpha-values
 * @param {Array.<Uint8ClampedArray>} colors
 * @returns {Uint8ClampedArray}
 */
export function (colors) {
  let r = colors[0][0]
  let g = colors[0][1]
  let b = colors[0][2]

  for(let i=1; i<colors.length; i++) {
    r += colors[i][0]
    g += colors[i][1]
    b += colors[i][2]
  }

  r = r / colors.length
  g = g / colors.length
  b = b / colors.length

  const color = new Uint8ClampedArray(3)
  color[0] = r
  color[1] = g
  color[2] = b

  return color
}