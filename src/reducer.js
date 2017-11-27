//import all reducers and combine them
import { combineReducers} from 'redux';

import common from './reducers/common';
import auth from './reducers/auth';
import game from './reducers/game';
import punishment from './reducers/punishment';
import punishmentCreation from './reducers/punishmentCreation';
import prefs from './reducers/prefs';
import graphData from './reducers/graphData';
import newPassword from './reducers/newPassword';

export default combineReducers({
    common,
    auth,
    game,
    punishment,
    punishmentCreation,
    prefs,
    graphData,
    newPassword
});