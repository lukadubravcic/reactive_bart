import superagent from 'superagent';

const API_ROOT = 'http://localhost:8000';

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
		.then(responseBody, (err) => {
			console.log('err GET THEN ');
			return null;
		}),
	post: (url, body) => superagent('POST', `${API_ROOT}${url}`)
		.type('form')
		.use(tokenPlugin)
		.send(body)
		.then(responseBody, (err) => {
			console.log(err);
			return null;
		})
};

const Auth = {
	current: () => requests.get('/users'),
	login: (email, password) => requests.post('/users/login', { email, password }),
	register: (username, email, password) => requests.post('/users/register', { username, email, password })
};

/* const Game = {
	getPunishment: () => requests.get(/)
} */

const Punishment = {
	createPunishment: (punishmentData) => requests.post('/punishment/create', punishmentData),
	getAccepted: () => requests.get('/punishment/accepted'),
	getPast: () => requests.get('/punishment/past'),
	getOrdered: () => requests.get('/punishment/ordered'),
	giveUp: (punishmentId) => requests.post('/punishment/giveup', { punishmentId: punishmentId }),
	saveProgress: (id, progress) => requests.post('/punishment/save', { id: id, progress: progress }),
	done: id => requests.post('/punishment/done', { id: id }),
	logTry: (id, timeSpent) => requests.post('/punishment/log', {id: id, timeSpent: timeSpent})
}

export default {
	Auth,
	Punishment,
	setToken: _token => { token = _token; }
}
