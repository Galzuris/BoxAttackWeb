import { gridSize } from "../game"
import { graphics } from "../utils/graphics"

const STATE_TAKE = 1

export class Crane {
    pos = { x: 0, y: 0 }
    boxId = 1
    state = STATE_TAKE

    init() { }

    enterScene() { }

    exitScene() { }

    draw() {
        graphics.drawCrane(this.pos.x, this.boxId == 0)
        if (this.boxId > 0) {
            graphics.drawBlock(this.boxId - 1, this.pos.x - gridSize / 2, this.pos.y + gridSize, 1)
        }
    }

    update(delta) {
    }
}
