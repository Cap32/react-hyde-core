
import Ask from 'http-ask';
import getConfigs from 'utils/getConfigs';

const {
	username, repo, client_id, client_secret,
} = getConfigs().github;

const GITHUB_API = 'https://api.github.com';

export const askGithub = new Ask(`${GITHUB_API}`);

client_id && client_secret && askGithub.query({ client_id, client_secret });

export const askRepo = askGithub
	.clone()
	.url('repos')
	.url(username)
	.url(repo)
;

export const askIssues = askRepo
	.query({ creator: username, state: 'open' })
	.clone()
	.url('issues')
;
