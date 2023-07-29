import { BOX_SCORE, game, gridSize } from "../game"
import { graphics } from "../utils/graphics"
import { clamp01, lerp } from "../utils/math"
import { Box } from "./box"

const S_WAIT = 1
const S_TAKE = 2
const S_PLACE = 3
const T_WAIT = 1

export class Crane {
    pos = { x: 0, y: 0 }
    boxId = 0
    #state = S_WAIT
    #timer = T_WAIT
    #time = T_WAIT
    #target = -64
    #start = -64

    init() {
        if (Math.random() > 0.5) {
            this.#target = -gridSize * 2
        } else {
            this.#target = graphics.canvas.width + gridSize * 2
        }
        this.#start = this.#target
        this.pos.x = this.#start
    }

    draw() {
        const px = Math.floor(this.pos.x)
        graphics.drawCrane(px, this.boxId == 0)
        if (this.boxId > 0) {
            graphics.drawBlock(this.boxId - 1, px - gridSize / 2, this.pos.y + gridSize, 1)
        }
    }

    #setTarget(p) {
        this.#start = this.pos.x
        this.#target = p
        this.#time = Math.abs(this.#start - this.#target) / game.craneSpeed
        if (this.boxId > 0) {
            this.#time *= 1.5
        }
        this.#timer = this.#time
    }

    update(delta) {
        this.#timer -= delta
        const k = clamp01(1 - this.#timer / this.#time)
        this.pos.x = lerp(this.#start, this.#target, k)

        if (this.#timer < 0) {
            switch (this.#state) {
                case S_WAIT:
                    this.#state = S_TAKE
                    let tp = -gridSize * 2
                    if (Math.random() > 0.5) {
                        tp = graphics.canvas.width + gridSize * 2
                    }
                    this.#setTarget(tp)
                    break
                case S_TAKE:
                    this.#state = S_PLACE
                    this.boxId = Math.floor(1 + Math.random() * 3)
                    const targetColumn = Math.floor(1 + Math.random() * (game.grid.cols - 2))
                    this.#setTarget(targetColumn * gridSize + gridSize / 2)
                    break
                case S_PLACE:
                    this.#state = S_WAIT                   

                    const b = new Box()
                    b.id = this.boxId
                    b.pos = {
                        x: this.pos.x - gridSize / 2,
                        y: gridSize + 1,
                    }
                    b.drop()
                    game.scene.add(b)
                    game.score += BOX_SCORE
                    
                    this.boxId = 0
                    this.#setTarget(this.pos.x)
                    this.#time = T_WAIT
                    this.#timer = this.#time
                    break
            }
        }
    }
}
