import { P1ID, P2ID } from "../game"
import { SIG_SW, SIG_SN, osc, SIG_SQ } from "./osc"

const kickSource = 'dist/sounds/m_kick.wav'
const hatSource = 'dist/sounds/m_hat.wav'
const snareSource = 'dist/sounds/m_snare.wav'
const selectSource = 'dist/sounds/select.wav'
const stackSource = 'dist/sounds/stack.wav'

// drums
const K = 'k'
const H = 'h'
const S = 's'
// notes
const F = 'f'
const G = 'g'
const Ab = 'ab'

const musicVol = 0.3

class Sounds {
    #musicVol = 0.3
    #enabled = false
    #hat
    #kick
    #select
    #stack
    #snare
    #limits = []

    constructor() {
        this.#select = new Audio(selectSource)
        this.#stack = new Audio(stackSource)

        this.#kick = new Audio(kickSource)
        this.#hat = new Audio(hatSource)
        this.#snare = new Audio(snareSource)
        this.#kick.volume = this.#musicVol
        this.#hat.volume = this.#musicVol
        this.#snare.volume = this.#musicVol
    }

    enable() {
        this.#enabled = true
    }

    playDrum(id) {
        switch (id) {
            case K:
                this.#kick.play()
                break
            case H:
                this.#hat.play()
                break
            case S:
                this.#snare.play()
                break
        }
    }

    disable() {
        this.#enabled = false
    }

    toggle() {
        this.#enabled = !this.#enabled

        const vol = this.#enabled ? musicVol : 0
        this.#kick.volume = vol
        this.#hat.volume = vol
        this.#snare.volume = vol
    }

    playHit() {
        if (this.#enabled == false) return
        if (this.#isLimit('hit', 100)) return
        const rnd = Math.random() * 10
        osc.signal(50 + rnd, 50, 0.1, SIG_SQ)
        const v2 = 10 + Math.random() * 20
        osc.signal(v2, v2, 0.05, SIG_SN)
    }

    playSelect() {
        if (this.#enabled == false) return
        this.#select.play()
    }

    playJump(id) {
        if (this.#enabled == false) return
        if (this.#isLimit('jump', 100)) return
        if (id == undefined) {
            osc.signal(700, 1000, 0.15, SIG_SW)
        } else {
            switch (id) {
                case P1ID:
                    osc.signal(650, 900, 0.15, SIG_SW)
                    break
                case P2ID:
                    osc.signal(600, 850, 0.15, SIG_SW)
                    break
            }
        }
    }

    playStack() {
        if (this.#enabled == false) return
        this.#stack.play()
    }

    #isLimit(name, durMills) {
        const id = this.#limits.indexOf(name)
        if (id >= 0) return true

        this.#limits.push(name)
        setTimeout(() => {
            this.#limits.splice(id, 1)
        }, durMills)

        return false
    }
}

export const sounds = new Sounds()