import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'localhost:8000';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
	if (token) {
		req.set('authorization', `Token ${token}`);
	}
}

const requests = {
	get: url => superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
	post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
	login: (email, password) => requests.post('/user', { user: { email, password } }),
	register: (email, username, password) => requests.post('/user', { username: username, email: email, password: password })
}

export default {
	Auth,
	setToken: _token => { token = _token; }
}
