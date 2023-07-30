import { sounds } from "../utils/sounds"

// drums
const K = 'k'
const H = 'h'
const S = 's'
// beeps
const F = 'f'
const G = 'g'
const Ab = 'ab'

export class Music {
    bpm = 120
    loop = false
    drums = []
    beeps = []

    #drums = [0]
    #beeps = [0]
    #loop = null
    #drumK = 0
    #beepK = 0

    unpack() {
        if (this.drums.length > 0) {
            this.#drums = []
            this.drums.forEach(ds => {
                ds.forEach(d => {
                    this.#drums.push(d)
                })
            })
        }

        if (this.beeps.length > 0) {
            this.#beeps = []
            this.beeps.forEach(bs => {
                bs.forEach(b => {
                    this.#beeps.push(b)
                })
            })
        }
    }

    play() {
        this.#drumK = 0
        this.#beepK = 0
        //const delta = 1000 / (this.bpm / 120)

        this.#loop = setInterval(() => {
            const beepId = this.#beeps[this.#beepK]
            const drumId = this.#drums[this.#drumK]
            sounds.playBeep(beepId)
            sounds.playDrum(drumId)

            this.#drumK++
            this.#beepK++
            if (this.#drumK >= this.#drums.length) {
                this.#drumK = 0
                if (this.loop == false) this.stop()
            }
            if (this.#beepK >= this.#beeps.length) {
                this.#beepK = 0
                if (this.loop == false) this.stop()
            }
        }, 250)
    }

    isPlaying() {
        return this.#loop !== null
    }

    stop() {
        clearInterval(this.#loop)
        this.#loop = null
    }
}

const D0 = [0, 0, 0, 0, 0, 0, 0, 0]
const D1 = [K, H, S, H, K, H, S, H]
const D2 = [K, H, S, H, K, H, S, S]

const B0 = [0, 0, 0, 0, 0, 0, 0, 0]
const B1 = [F, F, 0, G, 0, 0, 0, 0]
const B2 = [F, F, 0, G, 0, Ab, G, 0]
const B4 = [F, F, 0, 0, 0, 0, 0, G]
const B9 = [Ab, Ab, G, G, F, F, 0, 0]

export const gameMusic = new Music()
gameMusic.loop = true
gameMusic.drums = [D1, D1, D1, D2]
gameMusic.beeps = [B1, B1, B1, B2]
gameMusic.unpack()

export const overMusic = new Music()
overMusic.loop = false
overMusic.drums = [D0]
overMusic.beeps = [B9]
overMusic.unpack()

export const menuMusic = new Music()
menuMusic.loop = true
menuMusic.drums = [D0, D0, D0, D0]
menuMusic.beeps = [B4, B4, B4, B2]
menuMusic.unpack()