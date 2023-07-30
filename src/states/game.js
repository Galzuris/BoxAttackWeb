import { graphics } from "../utils/graphics"
import { game, GRID } from "../game"
import { KEY_ESC, keys } from "../utils/keys"
import { GameEndState } from "./gameEnd"

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
        
        graphics.drawNums(game.score, graphics.canvas.width / 2, 4, true)
    }

    update(delta) {
        this.#timer += delta
        this.#box = Math.sin(this.#timer) * 64
        game.scene.update(delta)
        game.grid.update(delta)

        if (keys.isPressed(KEY_ESC)) {
            game.gsm.change(new GameEndState(0, 0))
        }
    }

    exit() { }
}