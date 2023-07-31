export const KEY_ENTER = 'Enter'
export const KEY_SPACE = 'Space'
export const KEY_UP = 'ArrowUp'
export const KEY_DOWN = 'ArrowDown'
export const KEY_LEFT = 'ArrowLeft'
export const KEY_RIGHT = 'ArrowRight'
export const KEY_ESC = 'Escape'
export const KEY_W = 'KeyW'
export const KEY_A = 'KeyA'
export const KEY_S = 'KeyS'
export const KEY_D = 'KeyD'
export const KEY_M = 'KeyM'

class Keys {
    constructor() {
        this.keys = []
        this.callbacks = []
    }

    isPressed(code) {
        return this.keys[code] ?? false
    }

    init() {
        document.onkeydown = (e) => {
            const prev = this.isPressed(e.code)
            this.keys[e.code] = true
            if (prev == false) {
                this.callbacks.forEach(call => {
                    call(e.code, true)
                })
            }
        }

        document.onkeyup = (e) => {
            const prev = this.isPressed(e.code)
            this.keys[e.code] = false
            if (prev == true) {
                this.callbacks.forEach(call => {
                    call(e.code, false)
                })
            }
        }
    }

    sub(call) {
        this.callbacks.push(call)
    }

    unsub(call) {
        const index = this.callbacks.indexOf(call)
        if (index >= 0) {
            this.callbacks.splice(index, 1)
        }
    }

    clearSubs() {
        this.callbacks = []
    }
}

export const keys = new Keys()
