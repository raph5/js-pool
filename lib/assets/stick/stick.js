import { MAX_STICK_SETBACKS, STICK_STRENGTH } from "../../settings"
import { GameEvents } from "../../utils/events"
import * as renderer from "./renderer"



/**
 * Stick asset class
 */
export default class Stick {

  /**
   * @param { import("../../renderer").Layer } layer 
   * @param { import("../ball/ball").default } whiteBall
   * @param { import("../../canvas").default } canvas
   * @param {object} [option]
   * @param {number} [option.x]
   * @param {number} [option.y]
   * @param {number} [option.angle]
   * @param {number} [option.dist]
   */
  constructor(layer, whiteBall, canvas, option={}) {
    this.x = option.x ?? whiteBall.x
    this.y = option.y ?? whiteBall.y
    this.angle = option.angle ?? 0
    this.defaultDist = option.dist ?? 10
    
    this.canvas = canvas
    this.whiteBall = whiteBall
    this.layer = layer
    
    // rendrer only
    this.oldStartX = 0
    this.oldStartY = 0
    this.oldEndX = 0
    this.oldEndY = 0
    
    // gameplay only
    this.mouseDownDist = 0
    this.stikeDate = 0
    this.pitch = 0
    this.dist = this.defaultDist
    this.state = 0

    // subscribe to events
    GameEvents.subscribe('mousedown', (e) => {
      this.mouseDownDist = Math.sqrt( (this.whiteBall.x - e.mouseX)**2 + (this.whiteBall.y - e.mouseY)**2 )
      this.state = 1
    })

    GameEvents.subscribe('mouseup', () => {
      if(this.state === 1) {
        this.state = 2
      }
    })

    GameEvents.subscribe('mouseout', () => {
      if(this.state === 1) {
        this.state = 2
      }
    })
    
    GameEvents.subscribe('escapekey', () => {
      this.dist = this.defaultDist
      this.state = 0
    })
    
    GameEvents.subscribe('whiteballstrike', () => {
      this.stikeDate = performance.now()
      this.state = 3
    })
    
    GameEvents.subscribe('ballsarestoped', () => {
      this.layer.visible = true
      this.state = 0
      this.dist = this.defaultDist
      this.x = this.whiteBall.x
      this.y = this.whiteBall.y
    })
  }

  render() {
    if(this.state !== 3) {
      renderer.render(this)
    }
  }

  /**
   * Update stick
   */
  update(deltaTime) {

    // if stick is waiting to shoot
    if(this.state === 0) {
      
      // rotate the stick
      // delta between mouse and whiteBall position
      const dx = this.canvas.mouseX - this.whiteBall.x
      const dy = this.canvas.mouseY - this.whiteBall.y

      if(dx > 0) {
        this.angle = -Math.asin(dy / Math.sqrt(dx**2 + dy**2))
      }
      else {
        this.angle = Math.asin(dy / Math.sqrt(dx**2 + dy**2)) + Math.PI
      }
    }

    // if user adjust the power
    if(this.state === 1) {
      
      // change the stick distance with white ball
      this.dist = Math.sqrt( (this.whiteBall.x - this.canvas.mouseX)**2 + (this.whiteBall.y - this.canvas.mouseY)**2 ) - this.mouseDownDist
      
      if(this.dist < 0) {
        this.dist = 10
      }
      else if(this.dist > MAX_STICK_SETBACKS*2 + 3) {
        this.dist = MAX_STICK_SETBACKS + 10
      }
      else {
        this.dist = this.dist/2 + 10
      }

      this.pitch = this.dist
    }

    // if user drop the stick
    if(this.state === 2) {

      // strtike the ball
      this.dist = this.dist - deltaTime * 500

      if(this.dist <= 0) {  // strike !
        this.dist = 0

        // pitch whiteBall
        const vx = this.pitch * STICK_STRENGTH * -Math.cos(this.angle)
        const vy = this.pitch * STICK_STRENGTH * Math.sin(this.angle)

        GameEvents.emit('whiteballstrike', vx, vy)
      }
    }

    // if ball are moving
    if(this.state === 3) {

      // hide the stick after half a second
      if(performance.now() - this.stikeDate > 500) {
        this.layer.visible = false
      }
    }

  }

}