const rootDomain = 'michaelcuneo.com.au';
const stageDomain =
	$app.stage === 'production' ? 'dmarc.' + rootDomain : `${$app.stage}.${rootDomain}`;

export function domain({ subdomain, path }: { subdomain?: string; path?: string }) {
	let finalUrl = stageDomain;

	if (subdomain) {
		finalUrl = `${subdomain}.${finalUrl}`;
	}

	if (path) {
		finalUrl = `${finalUrl}${!path.startsWith('/') ? '/' : ''}${path}`;
	}

	return finalUrl;
}
