import type { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	ScanCommand,
	DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

export const listUsers: APIGatewayProxyHandlerV2 = async () => {
	try {
		const command = new ScanCommand({
			TableName: Resource.ThomasUser.name
		});

		const data = await documentClient.send(command);

		return {
			statusCode: 200,
			body: data.Items ? JSON.stringify(data.Items) : JSON.stringify('No users found')
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};

export const createUser: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const body = JSON.parse(event?.body || '');

	const params = {
		TableName: Resource.ThomasUser.name,
		Item: {
			id: body.id,
			email: body.email,
			createdAt: body.createdAt,
			updatedAt: body.updatedAt
		}
	};

	try {
		const putResult = await documentClient.send(new PutCommand(params));

		return {
			statusCode: 201,
			body: putResult ? JSON.stringify(putResult) : JSON.stringify('Error: User not created')
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};

export const getUser: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const email = event.pathParameters?.email || '';

	try {
		const command = new GetCommand({
			TableName: Resource.ThomasUser.name,
			Key: {
				email: email
			}
		});

		const user = await documentClient.send(command);

		return {
			statusCode: 200,
			body: user.Item ? JSON.stringify(user.Item) : JSON.stringify('Error: User not found')
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: err instanceof Error ? err.message : 'Unknown error occurred',
				stack: err instanceof Error ? err.stack : undefined
			})
		};
	}
};

export const updateUser: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const body = JSON.parse(event?.body || '');

	// Make a DynamoDB UpdateCommand parameter
	const params = {
		TableName: Resource.ThomasUser.name,
		Item: {
			id: body.id,
			email: body.email,
			createdAt: body.createdAt,
			updatedAt: body.updatedAt
		}
	};

	try {
		const updateResult = await documentClient.send(new PutCommand(params));

		return {
			statusCode: 200,
			body: updateResult ? JSON.stringify(updateResult) : JSON.stringify('Error: User not updated')
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};

export const deleteUser: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const email = JSON.parse(event?.body || '');

	try {
		const params = {
			TableName: Resource.ThomasUser.name,
			Key: {
				email: email
			}
		};

		const deleteResult = await documentClient.send(new DeleteCommand(params));

		return {
			statusCode: 200,
			body: deleteResult ? JSON.stringify(deleteResult) : JSON.stringify('Project not deleted')
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};
