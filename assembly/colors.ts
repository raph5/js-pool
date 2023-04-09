import type { rgba, rgb } from "./types"


// Additive Color Mixing layer by layer
// https://stackoverflow.com/questions/28900598/how-to-combine-two-colors-with-varying-alpha-values
export function mixRgbaLayers(colors: rgba[]): rgba {
  let color = colors[0]

  for(let i=1; i<colors.length; i++) {
    if(colors[i][3] == 0) {
      continue
    }
    
    const _ia: f32 = colors[i][3] / 255
    const _x: f32 = (1 - _ia) * (color[3] / 255)
    const _a: f32 = _x + _ia
    const r: i8 = (_ia*colors[i][0] + _x*color[0]) / _a
    const g: i8 = (_ia*colors[i][1] + _x*color[1]) / _a
    const b: i8 = (_ia*colors[i][2] + _x*color[2]) / _a
    const a: i8 = _a * 255
    color = [ r, g, b, a ]
  }

  return color
}


// Additive Color Mixing
// https://stackoverflow.com/questions/28900598/how-to-combine-two-colors-with-varying-alpha-values
export function mixRgbColors(colors: rgb[]): rgb {
  let color = colors[0]

  for(let i=1; i<colors.length; i++) {
    color[0] += colors[i][0]
    color[1] += colors[i][1]
    color[2] += colors[i][2]
  }

  color[0] = color[0] / colors.length
  color[1] = color[1] / colors.length
  color[2] = color[2] / colors.length

  return color
}