import type { pixelMap } from './types'

// GameEvent (used as a parametter of the render)
export class GameEvent {
  constructor(
    public id: string,
    public props: Map<string, i32>
  ) {}
}

// Render a new frame (with a set of events)
export function render(events: GameEvent[]): pixelMap {
  const time = Date.now()
}
