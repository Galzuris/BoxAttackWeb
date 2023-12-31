import { DEBUG, GRAVITY, JUMP_SPEED, P1_CONTROLS, PUSH_DELTA, P_IDLE_FRAMES, P_MAX_SPEED, P_WALK_FRAMES, GRID, GRIDH } from "../game"
import { graphics, playerSize } from "../utils/graphics"
import { keys } from "../utils/keys"
import { game } from "../game"
import { collide } from "../utils/collision"
import { BOX_DROP, Box } from "./box"
import { sounds } from "../utils/sounds"
import { GameEndState } from "../states/gameEnd"

export class Player {
    #index
    #frame
    #controls = P1_CONTROLS
    #speed = { x: 0, y: 0 }
    #left = Math.random() > 0.5 ? 1 : 0
    #walk = false
    #pushTimer
    pos = { x: 32, y: 32 }
    grnd = false
    #collider = null
    #aabb = null

    constructor(id, controls) {
        this.#index = id
        this.#frame = id
        this.#controls = controls
        this.#pushTimer = 0
    }

    init() { }

    draw() {
        const fr = Math.floor(this.#frame)
        const fid = this.#walk ? P_WALK_FRAMES[fr] : P_IDLE_FRAMES[fr]
        graphics.drawPlayer(
            this.pos.x - playerSize.w / 2,
            this.pos.y - playerSize.h,
            this.#index,
            fid,
            this.#left
        )

        if (DEBUG && this.#collider) {
            const c = this.#collider
            graphics.setColor('#FF0000')
            graphics.drawLine(c.left, this.pos.y - playerSize.h, c.left, this.pos.y)
            graphics.setColor('#00FF00')
            graphics.drawLine(c.right, this.pos.y - playerSize.h, c.right, this.pos.y)
            graphics.setColor('#FF00FF')
            graphics.drawLine(this.pos.x - playerSize.w / 2, c.down, this.pos.x + playerSize.w / 2, c.down)
            graphics.setColor('#00FFFF')
            graphics.drawLine(this.pos.x - playerSize.w / 2, c.up, this.pos.x + playerSize.w / 2, c.up)

            const ab = this.#aabb
            graphics.setColor('#0000FF77')
            graphics.context.fillRect(ab.x - ab.w / 2, ab.y - ab.h / 2, ab.w, ab.h)
        }
    }

    update(d) {
        this.#frame += d * 4
        if (this.#frame >= 2) this.#frame -= 2
        const pw = playerSize.w / 2
        this.#aabb = {
            x: Math.floor(this.pos.x),
            y: Math.floor(this.pos.y - playerSize.h / 2),
            w: playerSize.w,
            h: playerSize.h
        }
        const collider = collide(this.#aabb.x, this.#aabb.y, this.#aabb.w, this.#aabb.h)
        this.#collider = collider

        let s = this.#speed

        if (keys.isPressed(this.#controls.left)) {
            s.x = -P_MAX_SPEED
            this.#left = true
            this.#walk = true
        }
        else if (keys.isPressed(this.#controls.right)) {
            s.x = P_MAX_SPEED
            this.#left = false
            this.#walk = true
        }
        else {
            s.x = 0
            this.#walk = false
        }

        if (s.y < 0) {
            if (this.pos.y - playerSize.h + s.y * d <= collider.up) {
                this.pos.y = collider.up + playerSize.h
                s.y = 0
            }
        }

        if (s.x > 0) {
            if (this.pos.x + s.x * d + pw > collider.right) {
                this.pos.x = collider.right - pw
                s.x = 0
                const px = this.pos.x + GRID
                this.#push(px, 1, d)
            }
        } else {
            if (this.pos.x + s.x * d - pw < collider.left) {
                this.pos.x = collider.left + pw
                s.x = 0
                const px = this.pos.x - GRID
                this.#push(px, -1, d)
            }
        }

        // check box-collide on head
        if (this.grnd) {
            if (this.pos.y - playerSize.h - 1 <= collider.up) {
                console.log('die')
                game.gsm.change(new GameEndState(this.pos.x, this.pos.y - playerSize.h / 2))
                this.pos.y = -GRID
                sounds.playHit()            
                return
            }
        }

        this.grnd = false
        if (this.pos.y + s.y * d > collider.down) {
            this.pos.y = collider.down
            s.y = 0
            this.grnd = true
        }

        if (this.grnd && keys.isPressed(this.#controls.up)) {
            s.y = -JUMP_SPEED
            sounds.playJump(this.#index)
        }

        s.y += GRAVITY * d
        this.pos.x += s.x * d
        this.pos.y += s.y * d
        this.#speed = s
    }

    #push(x, dir, d) {
        this.#pushGrid(x, this.pos.y - GRIDH, dir, d)
        this.#pushBox(x, this.pos.y - 4, dir, d)
    }

    #pushGrid(x, y, dir, d) {
        if (game.grid.canPush(x, y, dir)) {
            this.#pushTimer += d
            if (this.#pushTimer > PUSH_DELTA) {
                game.grid.push(x, y, dir)
                this.#pushTimer = 0
            }
        } else {
            this.#pushTimer = 0
        }
    }

    #pushBox(x, y, dir, d) {
        const boxes = game.scene
            .findByType(Box)
            .filter(b =>
                b.mode == BOX_DROP
                && x >= b.pos.x && x <= b.pos.x + GRID
                && y >= b.pos.y && y <= b.pos.y + GRID
                && b.canPush(dir)
            )
        if (boxes.length == 0) return

        boxes.forEach(b => {
            b.moveTo(b.pos.x + dir * GRID, b.pos.y)
        })
    }
}