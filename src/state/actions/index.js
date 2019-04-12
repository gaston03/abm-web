import { createAction } from 'redux-actions'
import axios from 'axios'
// import dataJson from '../../resource/json/personas.json'

var axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 240000
})

const getHeaders = function(params = {}, contentType = 'application/json') {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': contentType
    }

    return {
        headers,
        params
    }
}

const apiCall = function(method, url, data, config, extra) {
    return axiosInstance[method](url, data, config).then(function(response) {
        if (response.status >= 200 && response.status < 300) {
            if (extra) {
                response.extra = extra
            }
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    }).catch(function(error) {
        return Promise.reject({ error: error })
    })
}

//
// ACTIONS - FOR EXPORT
//
export const PERSONA_ADD = 'PERSONA_ADD'
export const PERSONA_EDIT = 'PERSONA_EDIT'
export const PERSONA_DELETE = 'PERSONA_DELETE'
export const PERSONA_GET = 'PERSONA_GET'
export const PERSONA_GET_ONE = 'PERSONA_GET_GET_ONE'
export const PERSONA_CLEAN = 'PERSONA_CLEAN'

export const personaAdd = createAction(PERSONA_ADD, function(persona) {
    return apiCall('post', '/persona', persona, getHeaders())
})

export const personaEdit = createAction(PERSONA_EDIT, function(personaId, persona) {
    return apiCall('put', '/persona/' + personaId, persona, getHeaders())
})

export const personaDelete = createAction(PERSONA_DELETE, function(personaId) {
    return apiCall('delete', '/persona/' + personaId, getHeaders())
})

export const personaGet = createAction(PERSONA_GET, function(query, params) {
    let queryParams = Object.assign({}, params, query)
    return apiCall('get', '/persona', getHeaders(queryParams))
})

export const personaGetOne = createAction(PERSONA_GET_ONE, function(appCodename, personaId) {
    return apiCall('get', '/persona/' + personaId, getHeaders())
})

export const personaClean = createAction(PERSONA_CLEAN, function() {
    return Promise.resolve()
})
