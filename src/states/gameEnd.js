import { overMusic } from "../classes/music";
import { GRID, GRID2, game } from "../game";
import { graphics, fontSize, T_CENTER, T_LEFT } from "../utils/graphics";
import { KEY_ENTER, KEY_SPACE, keys } from "../utils/keys";
import { lerp } from "../utils/math";
import { sounds } from "../utils/sounds";
import { InitState } from "./init";

const TIME = 4

export class GameEndState {
    #timer = 0
    #pos
    #offset = 0
    #sPlayed = false

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

        keys.sub((c, s) => {
            if (s == false) return

            switch (c) {
                case KEY_SPACE:
                case KEY_ENTER:
                    game.gsm.change(new InitState())
                    sounds.playSelect()
                    break
            }            
        })
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
                if (this.#sPlayed == false) {
                    //sounds.playJump()
                    this.#sPlayed = true
                }
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

                const cx = graphics.canvas.width / 2
                const fh = fontSize.h + 2
                let y = graphics.canvas.height / 2 - fh * 2
                graphics.drawText('SCORE', cx, y, T_CENTER)
                y += fh
                graphics.drawNums(this.score, cx, y, true)
                y += fh * 2
                graphics.drawText("press 'space' to exit", cx, y, T_CENTER)
            }
        }
    }

    update(d) {
        this.#timer += d

        this.#offset += d * GRID
        if (this.#offset > GRID2) this.#offset -= GRID2
    }

    exit() {
        keys.clearSubs()
    }
}