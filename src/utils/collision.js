import { game, gridSize } from "../game"

export function mergeCollisions(c1, c2) {
    return {
        up: Math.max(c1.up, c2.up),
        down: Math.min(c1.down, c2.down),
        left: Math.max(c1.left, c2.left),
        right: Math.min(c1.right, c2.right),
    }
}

export function collide(x, y, w, h, ignore) {
    // [a, b]
    // [c, d]
    x = Math.floor(x)
    y = Math.floor(y)
    const w2 = Math.floor(w / 2)
    const h2 = Math.floor(h / 2)
    const a = { x: x - w2, y: y - h2 }
    const b = { x: x + w2, y: y - h2 }
    const c = { x: x - w2, y: y + h2 }
    const d = { x: x + w2, y: y + h2 }

    const gc = 2
    const sc = -2

    const ac = mergeCollisions(game.grid.getCollider(a.x + gc, a.y + gc), game.scene.getCollider(a.x - sc, a.y - sc, ignore))
    const bc = mergeCollisions(game.grid.getCollider(b.x - gc, b.y + gc), game.scene.getCollider(b.x + sc, b.y - sc, ignore))
    const cc = mergeCollisions(game.grid.getCollider(c.x + gc, c.y - gc), game.scene.getCollider(c.x - sc, c.y + sc, ignore))
    const dc = mergeCollisions(game.grid.getCollider(d.x - gc, d.y - gc), game.scene.getCollider(d.x + sc, d.y + sc, ignore))

    return {
        up: Math.max(ac.up, bc.up),
        down: Math.min(cc.down, dc.down),
        left: Math.max(ac.left, cc.left),
        right: Math.min(bc.right, dc.right),
    }
}
