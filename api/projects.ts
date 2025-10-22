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
			sort: body.sort,
			featuredImage: body.imageKey || null,
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
			Key: { projectId: id }
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

export const updateProject: APIGatewayProxyHandlerV2 = async (event) => {
	const body = JSON.parse(event?.body || '');

	const params = {
		TableName: Resource.ThomasProject.name,
		Key: {
			projectId: body.id,
			sort: Number(body.sort)
		},
		UpdateExpression: `
			SET title = :title,
				description = :description,
			  featuredImage = :featuredImage,
				createdAt = :createdAt,
			  updatedAt = :updatedAt
		`,
		ExpressionAttributeValues: {
			':title': body.title,
			':description': body.description,
			':featuredImage': body.imageKey,
			':createdAt': body.createdAt,
			':updatedAt': Date.now()
		}
	};

	try {
		const updateResult = await documentClient.send(new UpdateCommand(params));

		return {
			statusCode: 200,
			body: JSON.stringify(updateResult ?? 'No result from update')
		};
	} catch (err) {
		console.error('Update failed:', err);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Update error', details: err })
		};
	}
};

export const deleteProject: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
	const { id, sort } = JSON.parse(event?.body || '');

	try {
		const params = {
			TableName: Resource.ThomasProject.name,
			Key: {
				projectId: id,
				sort: Number(sort)
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
