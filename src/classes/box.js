import { BOX_DROP_SPEED, BOX_MOVE_TIME, game, GRID, GRIDH } from "../game"
import { GameEndState } from "../states/gameEnd"
import { collide } from "../utils/collision"
import { graphics } from "../utils/graphics"
import { lerp, clamp01 } from "../utils/math"
import { sounds } from "../utils/sounds"

export const BOX_SLIDE = 1
export const BOX_DROP = 2

export class Box {
    id = 1
    pos = { x: 4, y: 4 }
    startPos = { x: 0, y: 0 }

    drop() {
        this.mode = BOX_DROP
    }

    moveTo(x, y) {
        this.startPos = {
            x: this.pos.x,
            y: this.pos.y,
        }
        this.mode = BOX_SLIDE
        this.target = {
            x: x,
            y: y,
        }
        this.timer = BOX_MOVE_TIME
        this.time = BOX_MOVE_TIME
    }

    init() { }

    draw() {
        graphics.drawBlock(this.id - 1, this.pos.x, this.pos.y, 1)
    }

    update(delta) {
        switch (this.mode) {
            case BOX_SLIDE:
                this.#processMoveTo(delta)
                break
            case BOX_DROP:
                this.#processMoveDrop(delta)
                break
        }
    }

    canPush(dir) {
        const gpos = game.grid.toGrid(this.pos.x, this.pos.y)
        if (Math.abs(gpos.y * GRID - this.pos.y) >= 2) return false

        const c = collide(
            this.pos.x + GRIDH + 4, this.pos.y + GRIDH + 4, GRID - 8, GRID - 8,
            [this]
        )

        if (dir < 0) {
            return this.pos.x - c.left >= GRID
        } else {
            return c.right - GRID - this.pos.x >= GRID
        }
    }

    #processMoveTo(delta) {
        this.timer -= delta
        const k = clamp01(1 - this.timer / this.time)
        this.pos.x = lerp(this.startPos.x, this.target.x, k)
        this.pos.y = lerp(this.startPos.y, this.target.y, k)
        if (this.timer < 0) {
            this.timer = this.time
            this.materialize()
            this.mode = -1
        }
    }

    #processMoveDrop(delta) {
        const hg = GRIDH
        const c = collide(this.pos.x + hg, this.pos.y + hg, hg, hg, [this])
        this.pos.y += delta * BOX_DROP_SPEED
        if (this.pos.y + GRID > c.down) {
            this.pos.y = c.down - GRID            
            this.materialize()
            this.mode = -1
        }        
    }

    materialize() {
        const p = game.grid.toGrid(this.pos.x + GRIDH, this.pos.y + GRIDH)
        game.grid.set(p.x, p.y, this.id)
        game.scene.remove(this)

        if (this.mode == BOX_DROP) { //&& game.grid.isCollide(p.x, p.y + 1)
            sounds.playHit()
        }

        if (p.y == 1) // materialize to bad location => gameover
        {
            if (game.grid.isCollide(p.x, p.y + 1)) {
                game.gsm.change(
                    new GameEndState(this.pos.x + GRIDH, this.pos.y + GRIDH)
                )
            }
        }
    }
}