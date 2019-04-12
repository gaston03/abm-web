import * as actions from '../actions'

var defaultState = null

export default function persona(state = defaultState, action) {
    switch (action.type) {
        case actions.PERSONA_GET_ONE:
            var newState = state
            if (!action.error) {
                newState = action.payload
            }
            return newState

        default:
            return state

    }
}
