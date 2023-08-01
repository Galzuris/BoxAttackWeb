import { clamp01 } from "./math"

export const SIG_SW = 'sawtooth'
export const SIG_SN = 'sine'
export const SIG_SQ = 'square'
export const SIG_TR = 'triangle'

const NOTE_VOL = 0.3
const FX_VOL = 0.6

class Osc {
    #context = null

    init() {
        if (this.#context == null) {
            this.#context = new AudioContext()
        }
    }

    signal(fr1, fr2, time, form, vol) {
        const o = this.#context.createOscillator()
        const g = this.#context.createGain()
        const now = this.#context.currentTime

        o.type = form == undefined ? SIG_SW : form
        o.frequency.value = fr1
        o.frequency.exponentialRampToValueAtTime(fr2, now + time)
        o.connect(g)

        g.gain.value = vol == undefined ? FX_VOL : clamp01(vol)
        g.gain.exponentialRampToValueAtTime(0.00001, now + time + 0.1)
        g.connect(this.#context.destination)

        o.start(now)
        o.stop(now + time + 0.11)
    }

    playNote(freq, len, form) {
        len = len == undefined ? 0.2 : len
        form = form == undefined ? SIG_SW : form
        
        const o = this.#context.createOscillator()
        const g = this.#context.createGain()
        const now = this.#context.currentTime

        o.type = SIG_SW
        o.frequency.value = freq
        o.connect(g)

        g.gain.value = 0.0001 //NOTE_VOL
        //linearRampToValueAtTime
        g.gain.exponentialRampToValueAtTime(NOTE_VOL, now + 0.02)
        g.gain.exponentialRampToValueAtTime(0.00001, now + len)
        g.connect(this.#context.destination)

        o.start(now)
        o.stop(now + len)
    }
}

export const osc = new Osc()

export function testOsc() {
    var context = new AudioContext()
    var o = context.createOscillator()
    var g = context.createGain()
    o.type = 'sawtooth'
    o.connect(g)
    o.frequency.value = 620
    g.connect(context.destination)
    o.frequency.exponentialRampToValueAtTime(1000.0, context.currentTime + 0.2)
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.3)
    g.gain.value = 0.5

    o.start(context.currentTime)
    o.stop(context.currentTime + 1)
}