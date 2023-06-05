import { CARPET_COLOR, HEIGHT, PADDING_LEFT, PADDING_TOP, WIDTH, getGridIndex } from '../../settings'

/**
 * render the carpet on layer
 * @param {import('./carpet').default} carpet
 */
export function render(carpet) {
  let index = 0
  for(let y=0; y<HEIGHT; y++) {
    for(let x=0; x<WIDTH; x++) {

      if(PADDING_LEFT > x || x > WIDTH-1 - PADDING_LEFT || PADDING_TOP   > y || y > HEIGHT-1 - PADDING_TOP) {
        carpet.layer.data[index] = 0
        carpet.layer.data[index+1] = 0
        carpet.layer.data[index+2] = 0
        carpet.layer.data[index+3] = 255
      }
      else {
        carpet.layer.data[index] = CARPET_COLOR[0]
        carpet.layer.data[index+1] = CARPET_COLOR[1]
        carpet.layer.data[index+2] = CARPET_COLOR[2]
        carpet.layer.data[index+3] = CARPET_COLOR[3]
      }

      index += 4
    }
  }
}