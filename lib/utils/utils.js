

/**
 * Shuffle function based on :
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {Array} list
 */
export function shuffle(list) {
  
  for(let i=list.length-1; i>0; i--) {
    
    // pick random item
    const randomIndex = Math.floor( Math.random() * (i+1) )

    // switch elements
    const _el = list[i]
    list[i] = list[randomIndex]
    list[randomIndex] = _el

  }

  return list

}



/**
 * Transform an rgb hex color to a Unit8Array containing the r, g and b values
 * @param {number} hex 
 * @returns {Uint8ClampedArray}
 */
export function hexToColor(hex) {

  const color = new Uint8ClampedArray(3)

  color[0] = (hex & 0xff0000) >> 16
  color[1] = (hex & 0xff00) >> 8
  color[2] = hex & 0xff

  return color

}