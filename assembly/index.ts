/*
import { Game } from './game'
import { Renderer } from './renderer'
import { pixelMap } from './types'

// GameEvent (used as a parametter of the render)
class GameEvent {
  constructor(
    public id: string,
    public props: Map<string, i32>
  ) {}
}

export function createGameEvent(id: string, props: Map<string, i32>): GameEvent {
  return new GameEvent(id, props)
}




const renderer = new Renderer()
const game = new Game(renderer)

// Render a new frame (with a set of events)
export function render(events: GameEvent[] = []): pixelMap {
  // TODO: implement events
  return game.render()
}
*/

export function render(): i32 {
  new Map<string, string>()
  return 43
}