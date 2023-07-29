import { Crane } from "../classes/crane"
import { Player } from "../classes/player"
import { MODE_P1, MODE_P2, P1ID, P1_CONTROLS, P2ID, P2_CONTROLS, game, GRID, GRIDH } from "../game"
import { graphics } from "../utils/graphics"
import { GameState } from "./game"

export class GameStartState {
    enter() {
        console.log("game start")
        game.gsm.change(new GameState())
        game.grid.clear()
        game.grid.generate()
        game.scene.clear()
        game.score = 0

        for (let i = 0; i < 2 + game.mode; i++) {
            const crane = new Crane()
            crane.init()
            game.scene.add(crane)
        }

        switch (game.mode) {
            case MODE_P2:
                const p2 = new Player(P2ID, P2_CONTROLS)
                p2.pos.x = Math.floor(graphics.canvas.width * 0.75 / GRID) * GRID + GRIDH
                game.scene.add(p2)
            case MODE_P1:
                const p1 = new Player(P1ID, P1_CONTROLS)
                p1.pos.x = Math.floor(graphics.canvas.width * 0.25 / GRID) * GRID + GRIDH
                game.scene.add(p1)            
                break
        }        
    }

    draw() { }

    update() { }

    exit() { }
}