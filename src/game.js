import { Grid } from "./classes/grid"
import { InitState } from "./states/init"
import { StateMachine } from "./states/machine"
import { KEY_A, KEY_D, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_W } from "./utils/keys"
import { Scene } from "./utils/scene"

const frameDelta = 1000 / 60
const updateDelta = 1000 / 40

export const DEBUG = false
export const MODE_P1 = 1
export const MODE_P2 = 2
export const P1ID = 0
export const P2ID = 1
export const P1_CONTROLS = { up: KEY_W, left: KEY_A, right: KEY_D }
export const P2_CONTROLS = { up: KEY_UP, left: KEY_LEFT, right: KEY_RIGHT }
export const P_MAX_SPEED = 16 * 3 // player max speed - px per second
export const P_IDLE_FRAMES = [0, 1]
export const P_WALK_FRAMES = [2, 3]
export const GRAVITY = 256
export const JUMP_SPEED = 120
export const PUSH_DELTA = 0.2
export const BOX_DROP_SPEED = 32
export const BOX_SCORE = 10
export const BOX_MOVE_TIME = 0.4
export const ROW_SCORE = 200
export const GRID = 16
export const GRIDH = 8
export const GRID2 = 32

class Game {
    init() {
        this.score = 0
        this.craneSpeed = GRID * 4
        this.music = null

        this.mode = MODE_P1
        this.gsm = new StateMachine()
        this.scene = new Scene()
        this.grid = new Grid()
        this.grid.init()

        this.gsm.change(new InitState())
        this.timeScale = 1.2
        this.dateTime = Date.now()
        this.prevDateTime = this.dateTime
        this.deltaTime = 0

        setInterval(() => { this.draw() }, frameDelta)
        setInterval(() => { this.update() }, updateDelta)
    }

    draw() {
        const state = this.gsm.current()
        if (state) {
            state.draw()
        }
    }

    update() {
        this.dateTime = Date.now()
        this.deltaTime = ((this.dateTime - this.prevDateTime) / 1000.0) * this.timeScale

        const state = this.gsm.current()
        if (state) {
            state.update(this.deltaTime)
        }

        this.prevDateTime = this.dateTime
        this.craneSpeed = GRID * 4 + this.score/1000
    }
}

export const game = new Game()
