import { fontSize, graphics } from "../utils/graphics"
import { game } from "../game"
import { KEY_D, KEY_DOWN, KEY_ENTER, KEY_ESC, KEY_S, KEY_SPACE, KEY_UP, KEY_W, keys } from "../utils/keys"
import { sounds } from "../utils/sounds"
import { GameEndState } from "./gameEnd"

const pauseMenu = [
    'continue',
    'exit'
]

export class PauseState {
    #retState = null
    #selected = 0

    constructor(retState) {
        this.#retState = retState
    }

    enter() {
        console.log("pause")
        keys.sub((c, s) => {
            if (s == false) return
            this.#onKeyDown(c)
        })
        game.music.stop()
        sounds.playSelect()
    }

    draw() {
        const x = 16
        const hh = 40
        let y = 16
        let fh = fontSize.h + 2
        graphics.setColor('#000000')
        graphics.context.fillRect(x - 5, y - 5, 66, hh + 2)
        graphics.setBackgroundColor()
        graphics.context.fillRect(x - 4, y - 4, 64, hh)
        graphics.drawText("pause", x, y)
        y += fh * 2

        for (let i = 0; i < pauseMenu.length; i++) {
            const tx = (this.#selected == i ? '>' : ' ') + pauseMenu[i]
            graphics.drawText(tx, x, y)
            y += fh
        }
    }

    update(delta) { }

    exit() {
        keys.clearSubs()
        sounds.playSelect()
        game.music.play()
    }

    #onKeyDown(c) {
        switch (c) {
            case KEY_ESC:
                game.gsm.change(this.#retState)
                break
            case KEY_W:
            case KEY_UP:
                this.#selected--
                if (this.#selected < 0) this.#selected = pauseMenu.length - 1
                sounds.playJump()
                break
            case KEY_S:
            case KEY_DOWN:
                this.#selected++
                if (this.#selected >= pauseMenu.length) this.#selected = 0
                sounds.playJump()
                break
            case KEY_ENTER:
            case KEY_SPACE:
                if (this.#selected == 0) game.gsm.change(this.#retState)
                if (this.#selected == 1) game.gsm.change(new GameEndState(48, 48))
                break
        }
    }
}