import { Box } from "../classes/box"
import { GRID } from "../game"
import { graphics } from "./graphics"

export class Scene {
    constructor() {
        this.objects = []
    }

    add(object) {
        this.objects.push(object)
    }

    remove(object) {
        const id = this.objects.indexOf(object)
        if (id >= 0) {
            this.objects.splice(id, 1)
        }
    }

    filter(type) {
        return this.objects.filter(ob => ob instanceof type)
    }

    getCollider(x, y, ig) {
        const step = 4
        return {
            up: 0,
            left: this.#scanLeft(x, y, step, ig),
            right: this.#scanRight(x, y, step, ig),
            down: this.#scanDown(x, y, step, ig),
        }
    }

    #scanDown(x, y, step, ig) {
        for (let yy = y; yy <= graphics.canvas.height; yy += step) {
            const c = this.#findCollision(x, yy, ig)
            if (c === null) continue
            return c.pos.y
        }
        return graphics.canvas.height
    }

    #scanLeft(x, y, step, ig) {
        for (let xx = x; xx >= 0; xx -= step) {            
            const c = this.#findCollision(xx, y, ig)
            if (c === null) continue
            if (c instanceof Box) {
                return c.pos.x + GRID
            }
        }
        return 0
    }

    #scanRight(x, y, step, ig) {
        for (let xx = x; xx <= graphics.canvas.width; xx += step) {
            const c = this.#findCollision(xx, y, ig)
            if (c === null) continue
            return c.pos.x
        }
        return graphics.canvas.width
    }

    #findCollision(x, y, ig) {
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i]
            if (ig) {
                if (ig.indexOf(obj) >= 0) continue
            }

            if (obj instanceof Box) {
                if (x > obj.pos.x && x < obj.pos.x + GRID && y >= obj.pos.y && y <= obj.pos.y + GRID) {
                    return obj
                }
            }
        }
        return null
    }

    draw() {
        this.objects.forEach(obj => {
            obj.draw()
        })
    }

    update(delta) {
        this.objects.forEach(obj => {
            obj.update(delta)
        })
    }

    clear() {
        this.objects = []
    }
}