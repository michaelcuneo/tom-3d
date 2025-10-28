type Project = {
	projectId: string;
	title: string;
	description: string;
	sort: number;
	mediaUrl: string;
	featured: boolean;
	updatedAt: AWSDateTime;
	createdAt: AWSDateTime;
};

type User = {
	id: string;
	email: string;
	createdAt: AWSDateTime;
	updatedAt: AWSDateTime;
};

type Projects = Project[];
