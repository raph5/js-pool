import './style.css'


// import web assembly module
const wasmModuleUrl = new URL('./build/debug.wasm', import.meta.url).href
const module = await WebAssembly.instantiateStreaming(fetch(wasmModuleUrl))

// console.log(module.instance.exports.add(1, 5))



const fpsMonitor = document.getElementById('fps')
let fpsAvg = 25

// fpsAvg = (9*fpsAvg+1/deltaTime) / 10
// fpsMonitor.innerText = `${Math.round(fpsAvg)} fps`


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