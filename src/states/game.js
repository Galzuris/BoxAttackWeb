import { graphics } from "../utils/graphics"
import { game, gridSize } from "../game"

export class GameState {
    #box = 0
    #timer = 0

    enter() {
        console.log("game")
    }

    draw() {
        graphics.clear()
        game.grid.draw()
        game.scene.draw()

        const cp = graphics.canvas.width / 2 + this.#box
        graphics.drawCrane(cp, Math.floor(this.#timer) % 2 == 0)
        graphics.drawBlock(0, cp - gridSize / 2 - 1, + gridSize, 1)
        
        graphics.drawNums(game.score, graphics.canvas.width / 2, 4, true)
    }

    update(delta) {
        this.#timer += delta
        this.#box = Math.sin(this.#timer) * 64
        game.scene.update(delta)
        game.grid.update(delta)
    }

    exit() { }
}