import { graphics } from "../utils/graphics"
import { ROW_SCORE, game, GRID, GRIDH } from "../game"
import { Box } from "./box"

export class Grid {
    #fillTimer = 0
    #fxTimer = 0

    init() {
        this.cols = Math.ceil(graphics.canvas.width / GRID)
        this.rows = Math.ceil(graphics.canvas.height / GRID)
        this.data = []
        this.clear()
    }

    clear() {
        this.data = []
        for (let x = 0; x < this.cols; x++) {
            this.data[x] = []
            for (let y = 0; y < this.rows; y++) {
                this.data[x][y] = 0
            }
        }
    }

    generate() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.data[x][y] = Math.floor(Math.random() > 0.9 ? (1 + Math.random() * 4) : 0)
            }
        }
        for (let i = 0; i < this.rows + 4; i++) this.stepDown()
    }

    canPush(x, y, mx) {
        const c = this.toGrid(x, y)
        if (this.#isSafe(c.x, c.y) == false || c.x == 0 || c.x == this.cols - 1) {
            return false
        }

        const id = this.data[c.x][c.y]
        if (id == 0) {
            return false
        }

        if (mx < 0) { // push left            
            if (c.x == 0) return false
            if (this.data[c.x - 1][c.y] != 0) return false
        } else {
            if (c.x == this.cols - 1) return false
            if (this.data[c.x + 1][c.y] != 0) return false
        }

        return true
    }

    push(x, y, mx) {
        const c = this.toGrid(x, y)
        if (this.#isSafe(c.x, c.y)) {
            const b = new Box()
            b.id = this.data[c.x][c.y]
            b.pos = {
                x: c.x * GRID,
                y: c.y * GRID
            }
            b.moveTo((c.x + mx) * GRID, c.y * GRID)
            game.scene.add(b)
            this.data[c.x][c.y] = 0
        }
    }

    set(x, y, id) {
        if (this.#isSafe(x, y)) {
            this.data[x][y] = id
        }
    }

    update(delta) {
        this.#fxTimer += delta
        if (this.#fxTimer > 1) {
            this.#fxTimer -= 1
        }

        const yy = this.rows - 1
        let fill = true
        for (let x = 0; x < this.cols; x++) {
            if (this.data[x][yy] == 0) {
                fill = false
                break
            }
        }

        if (fill) {
            this.#fillTimer += delta
            if (this.#fillTimer > 1) {
                this.#fillTimer = 0
                for (let x = 0; x < this.cols; x++) {
                    this.data[x][yy] = 0
                    game.score += ROW_SCORE
                }
            }
        } else {
            this.#fillTimer = 0
        }

        for (let x = 0; x < this.cols; x++) {
            for (let y = this.rows - 2; y >= 0; y--) {
                const id = this.data[x][y]
                const down = this.data[x][y + 1]
                if (id != 0 && down == 0) {
                    const b = new Box()
                    b.id = this.data[x][y]
                    b.pos = {
                        x: x * GRID,
                        y: y * GRID,
                    }
                    b.drop()
                    game.scene.add(b)
                    this.data[x][y] = 0
                    return
                }
            }
        }
    }

    stepDown() {
        let t = this.data
        for (let y = this.rows - 1; y > 0; y--) {
            for (let x = 0; x < this.cols; x++) {
                if (t[x][y] == 0 && t[x][y - 1] > 0) {
                    t[x][y] = t[x][y - 1]
                    t[x][y - 1] = 0
                }
            }
        }
        this.data = t
    }

    draw() {
        this.#drawBackground()
        const ft = Math.floor(this.#fillTimer * 4) % 2 == 0
        const fxt = Math.floor(this.#fxTimer * 4) % 2 == 0

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                if (y == this.rows - 1 && this.#fillTimer > 0) {                    
                    if (ft) continue
                }

                const id = this.data[x][y]
                if (id > 0) {
                    graphics.drawBlock(id - 1, x * GRID, y * GRID, 1)
                    if (y == 2 && fxt) {
                        graphics.drawFxExclamation(x * GRID, y * GRID - GRIDH)
                    }
                }
            }
        }
    }

    #drawBackground() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.cols; y++) {
                let id = 0
                if (y <= 1) {
                    id = 3
                } else if (y < 4) {
                    id = 2
                } else if (y < 6) {
                    id = 1
                } else if (y == this.rows - 1) {
                    id = 2
                }

                if (x == 3 && y == 4) id = 2
                if (x == 9 && y == 3) id = 1

                graphics.drawBlock(id, x * GRID, y * GRID, 0)
            }
        }
    }

    getCollider(x, y) {
        const c = this.toGrid(x, y)
        return {
            up: 0,
            left: this.#scanLeft(c.x, c.y),
            right: this.#scanRight(c.x, c.y),
            down: this.#scanDown(c.x, c.y)
        }
    }

    #scanDown(x, y) {
        if (this.#isSafe(x, y)) {
            for (let i = y; i < this.rows; i++) {
                if (this.data[x][i] > 0) {
                    return i * GRID
                }
            }
        }
        return graphics.canvas.height
    }

    #scanLeft(x, y) {
        if (this.#isSafe(x, y)) {
            for (let i = x; i > 0; i--) {
                if (this.data[i][y] > 0) {
                    return i * GRID + GRID
                }
            }
        }
        return 0
    }

    #scanRight(x, y) {
        if (this.#isSafe(x, y)) {
            for (let i = x; i < this.cols; i++) {
                if (this.data[i][y] > 0) {
                    return i * GRID
                }
            }
        }
        return graphics.canvas.width
    }

    #isSafe(x, y) {
        return (x >= 0 && x < this.cols && y >= 0 && y < this.rows)
    }

    toGrid(x, y) {
        return {
            x: Math.floor(x / GRID + 0.01),
            y: Math.floor(y / GRID + 0.01),
        }
    }
}