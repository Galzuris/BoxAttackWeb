import { Player } from "../classes/player"
import { MODE_P1, MODE_P2, P1ID, P1_CONTROLS, P2ID, P2_CONTROLS, game } from "../game"
import { GameState } from "./game"

export class GameStartState {
    enter() {
        console.log("game start")
        game.gsm.change(new GameState())
        game.grid.clear()
        game.grid.generate()
        game.scene.clear()
        game.score = 0

        switch (game.mode) {
            case MODE_P2:
                const p2 = new Player(P2ID, P2_CONTROLS)
                game.scene.add(p2)
            case MODE_P1:
                const p1 = new Player(P1ID, P1_CONTROLS)
                game.scene.add(p1)            
                break
        }        
    }

    draw() { }

    update() { }

    exit() { }
}