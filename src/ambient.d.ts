type Project = {
	projectId: string;
	title: string;
	description: string;
	featuredImage?: string | null;
	featuredImageUrl?: string | null;
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
