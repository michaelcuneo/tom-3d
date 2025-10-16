import { Resource } from "sst";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

import type { Actions } from './$types';

export const actions = {
  contact: async ({ request }) => {
    const data = await request.formData();
    const first = data.get('first');
    const last = data.get('last');
    const email = data.get('email');
    const message = data.get('message');

    const client = new SESv2Client();

    await client.send(
      new SendEmailCommand({
        FromEmailAddress: `3dsoundfx@${Resource.Emailer.sender}`,
        Destination: {
          ToAddresses: ["me@michaelcuneo.com.au"]
        },
        Content: {
          Simple: {
            Subject: { Data: `You have a new email from, ${first} ${last}, with email: ${email}` },
            Body: {
              Text: { Data: message as string }
            }
          }
        }
      })
    );

    return { success: true };
  }
} satisfies Actions;
