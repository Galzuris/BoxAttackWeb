import { keys } from "./utils/keys"
import { graphics } from "./utils/graphics"
import { game } from "./game"
import { gameMusic, overMusic } from "./classes/music"

window.onload = () => {
    keys.init()
    graphics.init()
    game.init()
}