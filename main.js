import { Game } from './lib/game'
import { Renderer } from './lib/renderer'
import './style.css'


const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("poolCanvas"))
const renderer = new Renderer(canvas)
const game = new Game(renderer)

function r() {
  requestAnimationFrame(() => {
    game.ball.rx += 0.05
    game.ball.ry += 0
    game.render()
    r()
  })
}

r()