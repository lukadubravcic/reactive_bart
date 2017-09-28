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
			console.log('err POST then');
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

const CreatePunishment = {
	create: (punishmentData) => requests.post('/punishment/create', punishmentData)
}

export default {
	Auth,
	CreatePunishment,
	setToken: _token => { token = _token; }
}
