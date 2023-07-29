export class StateMachine {
    change(newState) {
        if (this.state) {
            this.state.exit()
        }
        this.state = newState
        this.state.enter()
    }

    current() {
        return this.state
    }
}
