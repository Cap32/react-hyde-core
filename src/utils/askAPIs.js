
import Ask from 'http-ask';
import getConfigs from 'utils/getConfigs';

const {
	username, repo, articlesPath, client_id, client_secret,
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

export const askContent = askRepo.clone().url('contents');

export const askArticles = askContent
	.clone()
	.url(articlesPath.replace(/^\//, ''))
;

export const askBlobs = askRepo
	.clone()
	.url('git/blobs')
;
