import superagent from 'superagent';

import { API_ROOT } from './constants/constants';

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
	googleLogin: accessToken => requests.post('/users/sociallogin/google', { accessToken }),
	facebookLogin: accessToken => requests.post('/users/sociallogin/facebook', { accessToken }),
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
	createPunishment: punishmentData => requests.post('/punishment/create', punishmentData),
	createdSharedPunishment: punishmentData => requests.post('/punishment/createshared', punishmentData),
	getNew: () => requests.get('/punishment/new'),
	getAccepted: () => requests.get('/punishment/accepted'),
	getPast: () => requests.get('/punishment/past'),
	getOrdered: () => requests.get('/punishment/ordered'),
	giveUp: punishmentId => requests.post('/punishment/giveup', { punishmentId: punishmentId }),
	done: (id, timeSpent) => requests.post('/punishment/done', { id, timeSpent }),
	guestDone: (userId, punishmentId, timeSpent) => requests.post('/punishment/guestDone', { userId, punishmentId, timeSpent }),
	logTry: (id, timeSpent, typedCharsNum) => requests.post('/punishment/log', { id, timeSpent, typedCharsNum }),
	guestLogTry: (userId, punishmentId, timeSpent, typedCharsNum) => requests.post('/punishment/guestLog', { userId, punishmentId, timeSpent, typedCharsNum }),
	getRandom: () => requests.get('/punishment/random'),
	getSpecial: () => requests.get('/punishment/special'),
	firstTime: id => requests.get(`/punishment/firsttime?id=${encodeURIComponent(id)}`),
	skoldboard: () => requests.get('/punishment/skoldboard'),
	accept: (punId, inAppFlag = true) => requests.get(`/punishment/accept?id=${encodeURIComponent(punId)}&iaf=${encodeURIComponent(inAppFlag)}`),
	reject: (punId, inAppFlag = true) => requests.get(`/punishment/reject?id=${encodeURIComponent(punId)}&iaf=${encodeURIComponent(inAppFlag)}`),
	poke: punId => requests.post('/punishment/poke', { punId: encodeURIComponent(punId) }),
	randomPunDone: (randomPunId, timeSpent) => requests.post('/punishment/randomdone', { randomPunId, timeSpent }),
	randomPunTry: (randomPunId, typedCharsNum) => requests.post('/punishment/randomlog', { randomPunId, typedCharsNum }),
	getSharedPunishment: sid => requests.post('/punishment/shared', { sid }),
	claimPunishment: uid => requests.post('/punishment/claim', { uid }),
	trySharedPunishment: uid => requests.post('/punishment/sharedtry', { uid }),
};

const Pref = {
	updatePreferences: prefs => requests.post('/prefs/update', prefs)
}

const Rollups = {
	getRollups: () => requests.get('/rollups/getrollups'),
	adClick: () => requests.post('/rollups/adclick', {}),
}

export default {
	Auth,
	Punishment,
	Pref,
	Rollups,
	setToken: _token => { token = _token; }
}
