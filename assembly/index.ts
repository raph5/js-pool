import { Game } from './game'
import { Renderer } from './renderer'
import { pixelMap } from './types'

// GameEvent (used as a parametter of the render)
export class GameEvent {
  constructor(
    public id: string,
    public props: Map<string, i32>
  ) {}
}


const renderer = new Renderer()
const game = new Game(renderer)

// Render a new frame (with a set of events)
export function render(events: GameEvent[]): pixelMap {
  // TODO: implement events
  return game.render()
}