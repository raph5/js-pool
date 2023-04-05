
/**
 * @typedef Rgba
 * @type {object}
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} a
 */


/**
 * Additive Color Mixing
 * https://stackoverflow.com/questions/28900598/how-to-combine-two-colors-with-varying-alpha-values
 * @param {Rgba[]} colors
 * @returns {Rgba}
 */
export function mixRgbaColors(colors) {
  let color = colors[0]

  for(let i=1; i<colors.length; i++) {
    const _a = (1 - color.a)*colors[i].a
    const a = _a + color.a
    const r = (_a*colors[i].r + color.a*color.r) / a
    const g = (_a*colors[i].g + color.a*color.g) / a
    const b = (_a*colors[i].b + color.a*color.b) / a
    color = { r, g, b, a }
  }

  return color
}