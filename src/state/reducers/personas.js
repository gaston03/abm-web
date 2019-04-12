import * as actions from '../actions'

var defaultState = null

export default function personas(state = defaultState, action) {
    switch (action.type) {
        case actions.PERSONA_GET:
            var newState = state
            if (!action.error) {
                newState = action.payload.data.result
            }
            return newState

        case actions.PERSONA_CLEAN:
            return defaultState

        default:
            return state
    }
}
