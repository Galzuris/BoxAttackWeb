const hitSource = 'dist/sounds/hit.wav'
const kickSource = 'dist/sounds/m_kick.wav'
const hatSource = 'dist/sounds/m_hat.wav'
const snareSource = 'dist/sounds/m_snare.wav'

// drums
const K = 'k'
const H = 'h'
const S = 's'
// notes
const F = 'f'
const G = 'g'
const Ab = 'ab'

const notesPack = [F, G, Ab]

class Sounds {
    #musicVol = 0.1
    #enabled = false
    #hit
    #hat
    #kick
    #snare

    #notes = []

    constructor() {
        this.#hit = new Audio(hitSource)
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

    playHit() {
        if (this.#enabled == false) return
        this.#hit.play()
    }
}

export const sounds = new Sounds()