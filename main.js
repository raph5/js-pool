import { Game } from './lib/game'
import { Renderer } from './lib/renderer'
import './style.css'


// setup game
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("poolCanvas"))
const renderer = new Renderer(canvas)
const game = new Game(renderer)


function render() {
  requestAnimationFrame(() => {
    game.render()
    render()
  })
}

render()