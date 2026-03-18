import production from './production'
import planning from './planning'

const api = {
    production: Object.assign(production, production),
    planning: Object.assign(planning, planning),
}

export default api