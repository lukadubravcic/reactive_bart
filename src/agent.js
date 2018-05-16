import superagent from 'superagent';

import { API_ROOT } from './constants/constants';

const encode = encodeURIComponent;

const responseBody = res => {
	return res.body;
}

let token = null;
const tokenPlugin = req => {
	if (token) {
		req.set('authorization', `JWT ${token}`);
	}
}

const requests = {
	get: url => superagent('GET', `${API_ROOT}${url}`)
		.use(tokenPlugin)
		.then(responseBody, err => {
			// console.log('err GET THEN ');
			return null;
		}),
	post: (url, body) => superagent('POST', `${API_ROOT}${url}`)
		.type('form')
		.use(tokenPlugin)
		.send(body)
		.then(responseBody)
};

const Auth = {
	current: () => requests.get('/users'),
	login: data => requests.post('/users/login', { ...data }),
	logout: () => requests.post('/users/logout'),
	register: (username, email, password) => requests.post('/users/register', { username, email, password }),
	specialRegister: (userID, password) => requests.post('/users/sregister', { userID, password }),
	setUsername: username => requests.post('/users/username', { username }),
	setUsernameAsGuest: (username, email) => requests.post('/users/guestUsername', { username, email }),
	setNewPassword: (currentPassword, newPassword, reNewPassword) => requests.post('/users/setNewPassword', { currentPassword, newPassword, reNewPassword }),
	forgotPassword: email => requests.post('/users/forgot', { email }),
	getPunishmentAsGuest: (userId, punishmentId) => requests.post('/users/guest', { userId, punishmentId }),
	checkIfUserExists: identity => requests.post('/users/exist', { identity }),
};

const Punishment = {
	createPunishment: (punishmentData) => requests.post('/punishment/create', punishmentData),
	getAccepted: () => requests.get('/punishment/accepted'),
	getPast: () => requests.get('/punishment/past'),
	getOrdered: () => requests.get('/punishment/ordered'),
	giveUp: (punishmentId) => requests.post('/punishment/giveup', { punishmentId: punishmentId }),
	done: (id, timeSpent) => requests.post('/punishment/done', { id, timeSpent }),
	guestDone: (userId, punishmentId, timeSpent) => requests.post('/punishment/guestDone', { userId, punishmentId, timeSpent }),
	logTry: (id, timeSpent, typedCharsNum) => requests.post('/punishment/log', { id, timeSpent, typedCharsNum }),
	guestLogTry: (userId, punishmentId, timeSpent, typedCharsNum) => requests.post('/punishment/guestLog', { userId, punishmentId, timeSpent, typedCharsNum }),
	getRandom: () => requests.get('/punishment/random'),
	getSpecial: () => requests.get('/punishment/special'),
	firstTime: id => requests.get(`/punishment/firsttime?id=${encodeURIComponent(id)}`),
	skoldboard: () => requests.get('/punishment/skoldboard'),
};

const Pref = {
	updatePreferences: prefs => requests.post('/prefs/update', prefs)
}

export default {
	Auth,
	Punishment,
	Pref,
	setToken: _token => { token = _token; }
}
