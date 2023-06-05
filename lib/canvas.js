import { GameEvents } from "./utils/events"

export default class Canvas {

  /**
   * Canvas class to interface with html canvas
   * @param {HTMLCanvasElement} canvas 
   */
  constructor(canvas) {

    // canvas element
    this.el = canvas
    
    // canvas context
    const _ctx = canvas.getContext('2d', { alpha: false })
    if(!_ctx) {
      throw new Error("Can't get the canva's 2d context")
    }
    this.ctx = _ctx

    // mouse position
    this.mouseX = 0
    this.mouseY = 0
    this.el.addEventListener('mousemove', (e) => {
      this.mouseX = e.x - this.el.offsetLeft
      this.mouseY = e.y - this.el.offsetTop
    })

    // click event
    this.el.addEventListener('mousedown', () => {
      GameEvents.emit('mousedown', this)
    })

    this.el.addEventListener('mouseup', () => {
      GameEvents.emit('mouseup', this)
    })

    this.el.addEventListener('mouseout', () => {
      GameEvents.emit('mouseout', this)
    })

    document.addEventListener('keyup', (e) => {
      if(e.key === 'Escape') GameEvents.emit('escapekey', this)
    })

  }

}