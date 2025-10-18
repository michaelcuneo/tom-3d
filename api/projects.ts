import type { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

export const listProjects: APIGatewayProxyHandlerV2 = async () => {
	try {
		const command = new ScanCommand({
			TableName: Resource.ThomasProject.name
		});

		const data = await documentClient.send(command);

		return {
			statusCode: 200,
			body: data.Items ? JSON.stringify(data.Items) : JSON.stringify('No projects found')
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};

export const createProject: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const body = JSON.parse(event?.body || '');

	const params = {
		TableName: Resource.ThomasProject.name,
		Item: {
			projectId: uuidv4(), // Generate a unique ID
			title: body.title,
			description: body.description,
			featuredImage: body.featuredImage || null,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}
	};

	try {
		const putResult = await documentClient.send(new PutCommand(params));

		return {
			statusCode: 200,
			body: putResult ? JSON.stringify(putResult) : JSON.stringify('Error: Project not created')
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

export const getProject: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const id = event.pathParameters?.id;

	try {
		const command = new GetCommand({
			TableName: Resource.ThomasProject.name,
			Key: { id }
		});

		const data = await documentClient.send(command);

		return {
			statusCode: 200,
			body: data.Item ? JSON.stringify(data.Item) : JSON.stringify('Error: Project not found')
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

export const updateProject: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const body = JSON.parse(event?.body || '');

	const params = {
		TableName: Resource.ThomasProject.name,
		Key: { id: body.id },
		UpdateExpression: 'SET onboard = :onboard, groups = :groups, updatedAt = :updatedAt',
		ExpressionAttributeValues: {
			':onboard': body.onboard,
			':groups': body.groups,
			':updatedAt': new Date().toISOString()
		}
	};

	try {
		const updateResult = await documentClient.send(new UpdateCommand(params));

		return {
			statusCode: 200,
			body: updateResult
				? JSON.stringify(updateResult)
				: JSON.stringify('Error: Project not updated')
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};

export const deleteProject: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const id = JSON.parse(event?.body || '');

	try {
		const params = {
			TableName: Resource.ThomasProject.name,
			Key: {
				id: id
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
