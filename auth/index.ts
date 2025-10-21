import { handle } from 'hono/aws-lambda';
import { issuer } from '@openauthjs/openauth';
import { CodeUI } from '@openauthjs/openauth/ui/code';
import { CodeProvider } from '@openauthjs/openauth/provider/code';
import { MemoryStorage } from '@openauthjs/openauth/storage/memory';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { subjects } from './subjects';
import { Resource } from 'sst';

import type { Theme } from '@openauthjs/openauth/ui/theme';

const MY_THEME: Theme = {
	primary: '#4A90E2',
	title: '3D Sound FX',
	radius: 'md',
	logo: 'https://halide.michaelcuneo.com.au/misc/mc.svg',
	favicon: 'https://halide.michaelcuneo.com.au/misc/mc.svg'
};

async function getUser(email: string) {
	// Get user from database and return user ID
	const url = Resource.ThomasProjectApi.url + '/user/get/' + email;
	const userResponse = await fetch(url);
	const user = await userResponse.json();

	return user.userId;
}

async function sendEmail(email: Record<string, string>, code: string) {
	const client = new SESv2Client();

	await client.send(
		new SendEmailCommand({
			FromEmailAddress: `3dsoundfx@${Resource.Emailer.sender}`,
			Destination: {
				ToAddresses: [email.email]
			},
			Content: {
				Simple: {
					Subject: { Data: `Hey, here is your login code from 3D Sound FX` },
					Body: {
						Text: { Data: `Your login code is: ${code}` }
					}
				}
			}
		})
	);
}

const app = issuer({
	theme: MY_THEME,
	subjects,
	storage: MemoryStorage(),
	// Remove after setting custom domain
	allow: async () => true,
	providers: {
		code: CodeProvider(
			CodeUI({
				sendCode: async (email, code) => {
					await sendEmail(email, code);
				}
			})
		)
	},
	success: async (ctx, value) => {
		if (value.provider === 'code') {
			return ctx.subject('user', {
				id: await getUser(value.claims.email)
			});
		}
		throw new Error('Invalid provider');
	}
});

export const handler = handle(app);
