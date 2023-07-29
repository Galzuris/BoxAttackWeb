import { graphics } from "../utils/graphics"
import { game } from "../game"

export class PauseState {
    enter() {
        console.log("pause")
    }

    draw() { }

    update(delta) { }

    exit() { }
}