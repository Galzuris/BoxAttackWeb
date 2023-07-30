import { overMusic } from "../classes/music";
import { game } from "../game";
import { graphics, numSize } from "../utils/graphics";
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
        game.music.stop()
        game.music = overMusic
        setTimeout(() => {
            game.music.play()
        }, 500)
    }

    draw() {
        const k = this.#timer / TIME
        const maxRad = Math.max(graphics.canvas.height, graphics.canvas.width) * 2
        if (k <= 0.5) {
            const rad = lerp(0, maxRad, k * 2)
            graphics.setColor('#000000')
            graphics.drawEllipse(this.#pos.x, this.#pos.y, rad)
        } else {
            const rad = lerp(0, maxRad, (k - 0.5) * 2)
            graphics.setBackgroundColor()
            graphics.drawEllipse(
                graphics.canvas.width / 2,
                graphics.canvas.height / 2,
                rad - 4
            )
            if (k > 0.7) {
                graphics.drawNums(
                    this.score,
                    graphics.canvas.width / 2,
                    (graphics.canvas.height - numSize.h) / 2,
                    true
                )
            }
        }
    }

    update(d) {
        this.#timer += d
    }

    exit() { }
}