

/**
 * @typedef eventId
 * @type { 'mousedown' | 'mouseup' | 'mouseout' | 'escapekey' | 'whiteballstrike' | 'ballsarestoped' }
 */

export class GameEvents {
  
  /**
   * @type {object}
   */
  static callbacks = {
    mousedown: [],
    mouseup: [],
    mouseout: [],
    escapekey: [],
    whiteballstrike: [],
    ballsarestoped: []
  }

  /**
   * Subscribe to the event by giving a callback too run on each event's occurrence
   * Return the subscription id
   * @param {eventId} event
   * @param {Function} callback
   * @returns {number} 
   */
  static subscribe(event, callback) {
    // add callback
    GameEvents.callbacks[event].push( callback )

    // return callback id
    return GameEvents.callbacks[event].length - 1
  }

  /**
   * Remove callback from callbacks list using its callbackId
   * @param {eventId} event
   * @param {number} callbackId 
   */
  static unsubscribe(event, callbackId) {
    this.callbacks[event][callbackId] = null
  }

  /**
   * Emit event by firing all callbacks
   * @param {eventId} event
   */
  static emit(event) {
    // loop over event's callbacks
    for(const callback of GameEvents.callbacks[event]) {
      // create args array
      const args = []
      for(let i=1; i<arguments.length; i++) {
        args.push(arguments[i])
      }

      // fire callback
      if(callback !== null) {
        callback.apply(null, args)
      }
    }
  }
  
}