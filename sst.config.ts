// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'tom-3d',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'aws',
			providers: {
				aws: {
					region: 'ap-southeast-2'
				}
			}
		};
	},
	async run() {
		const { domain } = await import('./helpers/domain.js');

		const ThomasBucket = new sst.aws.Bucket('ThomasBucket', {
			public: true
		});

		const emailer = new sst.aws.Email('Emailer', {
			sender: domain({}),
			dmarc: 'v=DMARC1; p=quarantine; adkim=s; aspf=s;'
		});

		const ThomasUser = new sst.aws.Dynamo('ThomasUser', {
			fields: {
				email: 'string'
			},
			primaryIndex: { hashKey: 'email' }
		});

		const ThomasProject = new sst.aws.Dynamo('ThomasProject', {
			fields: {
				projectId: 'string',
				createdAt: 'number'
			},
			primaryIndex: { hashKey: 'projectId', rangeKey: 'createdAt' }
		});

		const ThomasProjectApi = new sst.aws.ApiGatewayV2('ThomasProjectApi', {
			link: [ThomasProject, ThomasUser],
			cors: {
				allowOrigins: ['*'],
				allowHeaders: ['*'],
				allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			}
		});

		ThomasProjectApi.route('GET /', './api/api.handler');
		ThomasProjectApi.route('GET /projects/list', './api/projects.listProjects');
		ThomasProjectApi.route('POST /project/create', './api/projects.createProject');
		ThomasProjectApi.route('PUT /project/update/{projectId}', './api/projects.updateProject');
		ThomasProjectApi.route('DELETE /project/delete', './api/projects.deleteProject');

		ThomasProjectApi.route('GET /user/get/{email}', './api/users.getUser');
		ThomasProjectApi.route('POST /user/create', './api/users.createUser');
		ThomasProjectApi.route('DELETE /user/delete/{email}', './api/users.deleteUser');
		ThomasProjectApi.route('PUT /user/update', './packages/functions/src/users.updateUser');
		ThomasProjectApi.route('DELETE /user/delete', './packages/functions/src/users.deleteUser');

		const ThomasAuth = new sst.aws.Auth('ThomasAuth', {
			issuer: {
				link: [emailer, ThomasProjectApi],
				handler: 'auth/index.handler'
			}
		});

		new sst.aws.SvelteKit('ThomasWeb', {
			link: [ThomasAuth, ThomasProjectApi, ThomasBucket, emailer]
		});
	}
});
