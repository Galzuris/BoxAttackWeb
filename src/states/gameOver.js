import { game } from "../game";
import { graphics } from "../utils/graphics";
import { lerp } from "../utils/math";

const TIME = 4

export class GameOverState {
    #timer = 0

    enter() {
        this.score = game.score
    }

    draw() {        
        graphics.drawNums(this.score, 4, 4)

        const k = this.#timer / TIME
        const h = lerp(0, graphics.canvas.clientHeight, k)
        const y = graphics.canvas.height - h

        graphics.setBackgroundColor()
        graphics.context.fillRect(
            0, 
            y, 
            graphics.canvas.width, 
            h,
        )

        if (h < graphics.canvas.height)
        graphics.setColor('#000000')
        graphics.drawLine(0, y, graphics.canvas.clientWidth, y)
    }

    update(d) {
        this.#timer += d
     }

    exit() { }
}