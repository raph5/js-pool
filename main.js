import { Game } from './lib/game'
import { Renderer } from './lib/renderer'
import './style.css'


const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("poolCanvas"))
const renderer = new Renderer(canvas)
const game = new Game(renderer)

function r() {
  requestAnimationFrame(() => {
    // game.ball.rx += Math.PI / 2
    game.ball.rx += 0.2
    game.ball.ry += 0.2
    game.render()
    r()
  })
}

r()