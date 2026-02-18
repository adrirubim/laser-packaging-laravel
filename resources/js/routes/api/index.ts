import planning from './planning';
import production from './production';

const api = {
    production: Object.assign(production, production),
    planning: Object.assign(planning, planning),
};

export default api;
