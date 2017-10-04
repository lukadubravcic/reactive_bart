//import all reducers and combine them
import { combineReducers} from 'redux';

import common from './reducers/common';
import auth from './reducers/auth';
import game from './reducers/game';
import punishment from './reducers/punishment';
import punishmentCreation from './reducers/punishmentCreation';

export default combineReducers({
    common,
    auth,
    game,
    punishment,
    punishmentCreation
});