

/**
 * Store all collision to be solved
 */
export class CollisionStack {

  constructor() {
    /** @type { CollisionStackNode | null } */
    this.topNode = null
  }

  /**
   * Add a collision too the list
   * @param { import('./collision').Collision } collision
   */
  add(collision) {

    let newNode
    let nextNode = null
    let lastNode = this.topNode

    while(lastNode && collision.advancement < lastNode.collision.advancement) {
      nextNode = lastNode
      lastNode = lastNode.lastNode
    }

    newNode = new CollisionStackNode(collision, lastNode)

    if(nextNode !== null) {
      nextNode.lastNode = newNode
    }
    else {
      this.topNode = newNode
    }
    
  }

  /**
   * Solve the top collision
   */
  solveCollision() {
    
    // emptiness checking
    if( this.topNode === null ) {
      throw new Error("Can't solve collision because CollisionStack is empty")
    }

    // solve collision
    this.topNode.collision.solve()
    
    // remove collision form stack
    this.topNode = this.topNode.lastNode

  }

  /**
   * Remove all collision
   */
  clear() {
    this.topNode = null
  }

  /**
   * Check if collision stack is empty
   */
  isEmpty() {
    return this.topNode === null
  }

  /**
   * custom forEach function
   * @param {forEachCB} callback
   * 
   * @callback forEachCB
   * @param {CollisionStackNode} node
   */
  forEach(callback) {
    
    // start node
    let node = this.topNode
    
    // loop over nodes
    while(node !== null) {
      callback(node)
    }

  }

}



class CollisionStackNode {

  /**
   * @param { import('./collision').Collision } collision 
   * @param { CollisionStackNode | null } lastNode 
   */
  constructor(collision, lastNode) {
    this.collision = collision
    this.lastNode = lastNode
  }

}