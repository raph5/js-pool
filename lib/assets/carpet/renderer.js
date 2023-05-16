import { CARPET_COLOR, HIEGHT, WIDTH } from '../../settings'

/**
 * render the carpet on layer
 * @param {import('./index').default} carpet
 */
export function render(carpet) {
  const dataLength = (WIDTH*HIEGHT) << 2
  for(let i=0; i<dataLength; i+=4) {
    carpet.layer.data[i] = CARPET_COLOR[0]
    carpet.layer.data[i+1] = CARPET_COLOR[1]
    carpet.layer.data[i+2] = CARPET_COLOR[2]
    carpet.layer.data[i+3] = CARPET_COLOR[3]
  }
}