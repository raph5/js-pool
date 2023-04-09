import { Game } from './lib/game'
import { Renderer } from './lib/renderer'
import './style.css'


// import web assembly module
const wasmModuleUrl = new URL('./build/debug.wasm', import.meta.url).href
const module = await WebAssembly.instantiateStreaming(fetch(wasmModuleUrl))

console.log(module.instance.exports.add(1, 5))


const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("poolCanvas"))
const renderer = new Renderer(canvas)
const game = new Game(renderer)

function r() {
  requestAnimationFrame(() => {
    game.render()
    r()
  })
}

r()