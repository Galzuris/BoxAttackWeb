import { game } from "../game";
import { graphics } from "../utils/graphics";
import { lerp } from "../utils/math";

const TIME = 4

export class GameEndState {
    #timer = 0
    #pos

    constructor(x, y) {
        this.#pos = {
            x: x,
            y: y
        }
    }

    enter() {
        this.score = game.score
    }

    draw() {
        graphics.drawNums(this.score, 4, 4)
        const k = this.#timer / TIME
        const maxRad = Math.max(graphics.canvas.height, graphics.canvas.width) * 2
        if (k <= 0.5) {
            const rad = lerp(0, maxRad, k * 2)
            graphics.setColor('#000000')
            graphics.drawEllipse(this.#pos.x, this.#pos.y, rad)
        } else {
            const rad = lerp(0, maxRad, (k - 0.5) * 2)
            graphics.setBackgroundColor()
            graphics.drawEllipse(this.#pos.x, this.#pos.y, rad - 4)
        }        
    }

    update(d) {
        this.#timer += d
    }

    exit() { }
}