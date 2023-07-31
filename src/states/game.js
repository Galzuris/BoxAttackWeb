import { graphics } from "../utils/graphics"
import { game } from "../game"
import { KEY_ESC, KEY_M, keys } from "../utils/keys"
import { PauseState } from "./pause"

export class GameState {
    #box = 0
    #timer = 0

    enter() {
        console.log("game")
        keys.sub((c, s) => {
            if (s == false) return
            this.#onKeyDown(c)
        })
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
    }

    exit() {
        keys.clearSubs()
    }

    #onKeyDown(c) {
        switch (c) {
            case KEY_ESC:
                //game.gsm.change(new GameEndState(0, 0))
                game.gsm.change(new PauseState(this))
                break
            case KEY_M:
                //sounds.toggle()
                //console.log('toggle music')
                break
        }
    }
}