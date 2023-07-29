import { GRID } from "../game";

const background = "#CCDCA2"
const canvasId = "game"
const blocksSprite = "dist/images/blocks.png"
const numsSprite = "dist/images/nums.png"
const titleSprite = "dist/images/title.png"
const playersSprite = "dist/images/players.png"
const craneSprite = "dist/images/crane.png"
const fxSprite = "dist/images/fx.png"

export const numSize = { w: 4, h: 8 }
export const playerSize = { w: 12, h: 16 }

class Graphics {
    #blocks
    #nums
    #players
    #crane
    #fx

    init() {
        this.canvas = document.getElementById(canvasId)
        this.context = this.canvas.getContext("2d")
        this.context.lineWidth = 2

        this.#blocks = this.loadImage(blocksSprite)
        this.#nums = this.loadImage(numsSprite)
        this.#players = this.loadImage(playersSprite)
        this.#crane = this.loadImage(craneSprite)
        this.#fx = this.loadImage(fxSprite)
        this.title = this.loadImage(titleSprite)
    }

    loadImage(src) {
        const img = new Image()
        img.src = src
        return img
    }

    clear() {
        this.setColor(background)
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    setBackgroundColor() {
        this.setColor(background)
    }

    setColor(h) {
        this.context.fillStyle = h
        this.context.strokeStyle = h
    }

    drawLine(x1, y1, x2, y2) {
        this.context.beginPath()
        this.context.moveTo(Math.floor(x1), Math.floor(y1))
        this.context.lineTo(Math.floor(x2), Math.floor(y2))
        this.context.stroke()
    }

    drawEllipse(x, y, rad) {
        x = Math.floor(x)
        y = Math.floor(y)
        rad = Math.floor(Math.max(rad, 0))

        this.context.beginPath()
        this.context.ellipse(x, y, rad, rad, 0, 0, Math.PI * 2)
        this.context.fill()
    }

    drawCrane(x, open) {
        const cw = this.#crane.width / 2
        const frame = (open == true ? 1 : 0) * cw
        x = Math.floor(x)
        this.context.drawImage(
            this.#crane,
            frame, 0, cw, cw,
            x - cw / 2, 0, cw, cw
        )
    }

    drawBlock(id, x, y, offset) {
        x = Math.ceil(x)
        y = Math.ceil(y)
        this.context.drawImage(
            this.#blocks,
            id * GRID, offset * GRID, GRID, GRID,
            x, y, GRID, GRID
        )
    }

    drawNums(nums, x, y, centered) {
        x = Math.ceil(x)
        y = Math.ceil(y)
        const val = '' + nums
        const len = val.length
        const width = val.length * numSize.w + 1
        let offset = x
        if (centered === true) {
            offset = Math.ceil(x - width / 2)
        }

        this.setColor(background)
        this.context.fillRect(offset - 1, y - 1, width, numSize.h + 1)

        for (let i = 0; i < len; i++) {
            const n = parseInt(val[i])
            this.context.drawImage(
                this.#nums,
                n * numSize.w, 0, numSize.w, numSize.h,
                offset + i * numSize.w, y, numSize.w, numSize.h
            )
        }
    }

    drawPlayer(x, y, id, frame, isLeft) {
        x = Math.floor(x)
        y = Math.floor(y)
        const oy = Math.floor(id * playerSize.h * 2 + (isLeft === true ? 0 : playerSize.h))
        const ox = Math.floor(frame * playerSize.w)

        this.context.drawImage(
            this.#players,
            ox, oy, playerSize.w, playerSize.h,
            x, y, playerSize.w, playerSize.h,
        )
    }

    drawFxExclamation(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        this.context.drawImage(
            this.#fx,
            0, 0, this.#fx.width, this.#fx.height / 2,
            x, y, this.#fx.width, this.#fx.height / 2,
        )
    }
}

export const graphics = new Graphics()
