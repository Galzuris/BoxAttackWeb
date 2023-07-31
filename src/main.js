import { keys } from "./utils/keys"
import { graphics } from "./utils/graphics"
import { game } from "./game"

window.onload = () => {
    keys.init()
    graphics.init()
    game.init()
}
