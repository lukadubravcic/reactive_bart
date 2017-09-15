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
	// post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
	post: (url, body) => superagent('POST', `${API_ROOT}${url}`)
		.type('form')
		.use(tokenPlugin)
		.send(body)
		.then(responseBody, (err) => {
			console.log('ulaz: err POST then');
			// console.log(err);
			return null;
		})
};

const Auth = {
	current: () => requests.get('/users'),
	login: (email, password) => requests.post('/users/login', { email, password }),
	register: (name, email, password) => requests.post('/users/register', { name, email, password })
};

export default {
	Auth,
	setToken: _token => { token = _token; }
}
