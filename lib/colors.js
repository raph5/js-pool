
/**
 * @typedef Rgba
 * @type {object}
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} a
 * 
 * @typedef Rgb
 * @type {object}
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */



const colorMixCache = {}
/**
 * Additive Color Mixing layer by layer
 * https://stackoverflow.com/questions/28900598/how-to-combine-two-colors-with-varying-alpha-values
 * @param {Rgba[]} colors
 * @returns {Rgba}
 */
export function mixRgbaLayers(colors) {
  let color = colors[0]

  for(let i=1; i<colors.length; i++) {
    if(colors[i].a == 0) {
      continue
    }
    
    const _ia = colors[i].a / 255
    const _x = (1 - _ia) * (color.a / 255)
    const _a = _x + _ia
    const r = (_ia*colors[i].r + _x*color.r) / _a
    const g = (_ia*colors[i].g + _x*color.g) / _a
    const b = (_ia*colors[i].b + _x*color.b) / _a
    const a = _a * 255
    color = { r, g, b, a }
  }

  return {
    r: color.r,
    g: color.g,
    b: color.b,
    a: color.a
  }
}

/**
 * Additive Color Mixing
 * https://stackoverflow.com/questions/28900598/how-to-combine-two-colors-with-varying-alpha-values
 * @param {Rgb[]} colors
 * @returns {Rgb}
 */
export function mixRgbColors(colors) {
  let { r, g, b } = colors[0]

  for(let i=1; i<colors.length; i++) {
    r += colors[i].r
    g += colors[i].g
    b += colors[i].b
  }

  r = r / colors.length
  g = g / colors.length
  b = b / colors.length

  return { r, g, b }
}