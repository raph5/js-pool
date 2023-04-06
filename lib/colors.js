
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
    const _a = (255 - colors[i].a)*color.a
    const a = _a + colors[i].a
    const r = (colors[i].a*colors[i].r + _a*color.r) / a
    const g = (colors[i].a*colors[i].g + _a*color.g) / a
    const b = (colors[i].a*colors[i].b + _a*color.b) / a
    color = { r, g, b, a }
  }

  return {
    r: Math.round(color.r),
    g: Math.round(color.g),
    b: Math.round(color.b),
    a: Math.round(color.a)
  }
}