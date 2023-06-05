import Canvas from './lib/canvas'
import { Game } from './lib/game'
import { Renderer } from './lib/renderer'
import './style.css'


// setup game
const canvasEl = /** @type {HTMLCanvasElement} */ (document.getElementById("poolCanvas"))
const canvas = new Canvas(canvasEl)
const renderer = new Renderer(canvas)
const game = new Game(renderer, canvas)


// redering function
function render() {
  requestAnimationFrame(() => {
    game.render()
    render()
  })
}

render()