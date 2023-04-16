import './style.css'

const WIDTH = 800
const HEIGHT = 400


// import web assembly module
const wasmModuleUrl = new URL('./build/debug.wasm', import.meta.url).href
const module = await WebAssembly.instantiateStreaming(fetch(wasmModuleUrl))
const renderer = module.instance.exports.render


// get canvas context
const canvas = document.getElementById("poolCanvas")
const ctx = canvas.getContext('2d')


// setup fps monitor
const fpsMonitor = document.getElementById('fps')
let fpsAvg = 25
// fpsAvg = (9*fpsAvg+1/deltaTime) / 10
// fpsMonitor.innerText = `${Math.round(fpsAvg)} fps`


function render() {
  requestAnimationFrame(() => {
    
    const imgData = ctx.createImageData(WIDTH, HEIGHT)
    const renderData = renderer()

    console.log('renderData')

    renderData.forEach((coordinates, color) => {
      const _index = coordinates[0] + coordinates[1] * WIDTH
      imgData[_index + 0] = color[0]
      imgData[_index + 1] = color[1]
      imgData[_index + 2] = color[2]
      imgData[_index + 3] = color[3]
    })

    ctx.putImageData(imgData)

  })
  render()
}

render()