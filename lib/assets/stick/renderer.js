import { BALL_RADIUS, BALL_WIDTH, STICK_COLOR, STICK_LENGTH, STICK_POINT_COLOR, getGridIndex } from '../../settings'
import { HEIGHT, WIDTH } from '../../settings'


// TODO: make gradient borders and stick shadow

/**
 * Render the stick on layer
 * @param {import('./stick').default} stick
 */
export function render(stick) {

  // clear old stick
  for(let x=stick.oldStartX; x<=stick.oldEndX; x++) {
    for(let y=stick.oldStartY; y<=stick.oldEndY; y++) {
      let index = getGridIndex(x, y) * 4
      stick.layer.data[index] = 0
      stick.layer.data[index+1] = 0
      stick.layer.data[index+2] = 0
      stick.layer.data[index+3] = 0
    }
  }

  const cosAngle = Math.cos(stick.angle)
  const sinAngle = -Math.sin(stick.angle)

  const pointX = stick.x + cosAngle * (BALL_RADIUS + stick.dist)
  const pointY = stick.y + sinAngle * (BALL_RADIUS + stick.dist)
  const handleX = pointX + cosAngle * STICK_LENGTH
  const handleY = pointY + sinAngle * STICK_LENGTH
  const dx = pointX - handleX
  const dy = pointY - handleY

  const startX = Math.floor( Math.max(Math.min(pointX, handleX), 6) ) - 6
  const startY = Math.floor( Math.max(Math.min(pointY, handleY), 6) ) - 6
  const endX = Math.ceil( Math.min(Math.max(pointX, handleX), WIDTH-7) ) + 6
  const endY = Math.ceil( Math.min(Math.max(pointY, handleY), HEIGHT-7) ) + 6
  stick.oldStartX = startX
  stick.oldStartY = startY
  stick.oldEndX = endX
  stick.oldEndY = endY

  for(let x=startX; x<=endX; x++) {
    for(let y=startY; y<endY; y++) {

      // comput the orthogonal projection of (x; y) on the billiard stick
      const p = ((x - pointX)*dx + (y - pointY)*dy) / (dx**2 + dy**2)
      const projX = dx * p + pointX
      const projY = dy * p + pointY

      // distance between stick and (x; y)
      const dist = (projX - x)**2 + (projY - y)**2

      // distance between stick point and (projX; projY)
      const distToPoint = Math.sqrt( (projX - pointX)**2 + (projY - pointY)**2 )
      const width = 5 + 12 * (distToPoint/STICK_LENGTH)

      if(dist < width && (dx < 0 && pointX < projX && projX < handleX || dx >= 0 && handleX < projX && projX < pointX)) {

        const color = distToPoint < 10 ? STICK_POINT_COLOR : STICK_COLOR

        const gridIndex = getGridIndex(x, y) * 4
        stick.layer.data[gridIndex] = color[0]
        stick.layer.data[gridIndex+1] = color[1]
        stick.layer.data[gridIndex+2] = color[2]
        stick.layer.data[gridIndex+3] = 255
      }
      
    }
  }

}