import { game, GRID, GRID2 } from "../game"
import { keys } from "../utils/keys"
import { KEY_A, KEY_D, KEY_LEFT, KEY_RIGHT, KEY_SPACE, KEY_ENTER } from "../utils/keys"
import { MODE_P1, MODE_P2 } from "../game"
import { graphics } from "../utils/graphics"
import { GameStartState } from "./gameStart"

export class InitState {
    #offset = 0

    enter() {
        game.mode = MODE_P1
        console.log("init")
        keys.sub((c, s) => {
            this.onkey(c, s)
        })
    }

    exit() {
        keys.clearSubs()
    }

    draw() {
        graphics.clear()
        const ww = game.grid.cols
        const hh = game.grid.rows + 2
        for (let x = 0; x < ww; x++) {
            const mx = x % 2 == 0
            for (let y = 0; y < hh; y++) {
                const my = y % 2 == 0
                const id = ((mx && (!my)) || ((!mx) && my)) ? 0 : 2
                const of = (id == 0 && (x == 0 || x == game.grid.cols - 1)) ? 1 : 0

                graphics.drawBlock(id, x * GRID, y * GRID + Math.ceil(this.#offset - GRID2), of)
            }
        }

        const cx = Math.floor(graphics.canvas.width / 2)
        const cy = Math.floor((graphics.canvas.height + graphics.title.height) / 2) + 1
        let sx = cx - 8
        if (game.mode == MODE_P2) {
            sx = cx + 8
        }
        graphics.setColor('#000000FF')
        graphics.drawLine(sx - 4, cy, sx + 3, cy)

        const tx = Math.floor((graphics.canvas.width - graphics.title.width) / 2)
        const ty = Math.floor((graphics.canvas.height - graphics.title.height) / 2)
        graphics.context.drawImage(graphics.title, tx, ty)
    }

    onkey(code, state) {
        if (state === false) {
            return
        }

        switch (code) {
            case KEY_A:
            case KEY_LEFT:
                game.mode = MODE_P1
                break
            case KEY_D:
            case KEY_RIGHT:
                game.mode = MODE_P2
                break
            case KEY_SPACE:
            case KEY_ENTER:
                game.gsm.change(new GameStartState())
                break
        }
    }

    update(delta) {
        this.#offset += delta * GRID
        if (this.#offset > GRID2) this.#offset -= GRID2
    }
}
