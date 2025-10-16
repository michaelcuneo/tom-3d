
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "tom-3d",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "ap-southeast-2",
        },
      }
    };
  },
  async run() {
    new sst.aws.Bucket("ThomasBucket");

    const emailer = new sst.aws.Email("Emailer", {
      sender: "dmarc.michaelcuneo.com.au",
      dmarc: "v=DMARC1; p=quarantine; adkim=s; aspf=s;"
    });

    new sst.aws.Dynamo("ThomasUser", {
      fields: {
        userId: "string",
        email: "string",
      },
      primaryIndex: { hashKey: "email", rangeKey: "userId" },
    });

    new sst.aws.Dynamo("ThomasProject", {
      fields: {
        projectId: "string",
        createdAt: "number",
      },
      primaryIndex: { hashKey: "projectId", rangeKey: "createdAt" },
    });

    const ThomasAuth = new sst.aws.Auth('ThomasAuth', {
      issuer: {
        link: [emailer],
        handler: 'auth/index.handler'
      }
    });

    new sst.aws.SvelteKit("ThomasWeb", {
      link: [ThomasAuth, emailer],
    });
  },
});
