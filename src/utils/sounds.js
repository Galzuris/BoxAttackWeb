const hitSource = 'dist/sounds/hit.wav'
const kickSource = 'dist/sounds/m_kick.wav'
const hatSource = 'dist/sounds/m_hat.wav'
const snareSource = 'dist/sounds/m_snare.wav'
const selectSource = 'dist/sounds/select.wav'
const jumpSource = 'dist/sounds/jump.wav'
const stackSource = 'dist/sounds/stack.wav'

// drums
const K = 'k'
const H = 'h'
const S = 's'
// notes
const F = 'f'
const G = 'g'
const Ab = 'ab'

const notesPack = [F, G, Ab]
const musicVol = 0.3

class Sounds {
    #musicVol = 0.3
    #enabled = false
    #hit
    #hat
    #kick
    #select
    #stack
    #jump
    #snare
    #notes = []

    constructor() {
        this.#hit = new Audio(hitSource)
        this.#select = new Audio(selectSource)
        this.#jump = new Audio(jumpSource)
        this.#stack = new Audio(stackSource)

        this.#kick = new Audio(kickSource)
        this.#hat = new Audio(hatSource)
        this.#snare = new Audio(snareSource)        
        this.#kick.volume = this.#musicVol
        this.#hat.volume = this.#musicVol
        this.#snare.volume = this.#musicVol

        // load notes
        notesPack.forEach(n => {
            this.#notes[n] = new Audio('dist/sounds/m_beep_' + n + '.wav')
            this.#notes[n].volume = this.#musicVol
        });
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

    playBeep(id) {
        if (id !== 0) {
            this.#notes[id].play()
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
        // dont work
        this.#notes.forEach((v, id) => {
            this.#notes[id].volume = vol
        })
    }

    playHit() {
        if (this.#enabled == false) return
        this.#hit.play()
    }

    playSelect() {
        if (this.#enabled == false) return
        this.#select.play()
    }

    playJump() {
        if (this.#enabled == false) return
        this.#jump.play()
    }

    playStack() {
        if (this.#enabled == false) return
        this.#stack.play()
    }
}

export const sounds = new Sounds()