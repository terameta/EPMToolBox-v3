import { LoadState } from './generic.loadstate';

export interface Artifact {
	id: number,
	type: ArtifactType,
	loadState: LoadState
}

export interface DatabaseList extends Artifact {
	type: ArtifactType.DatabaseList,
	environment: number,
	list: { name: string }[]
}

export interface TableList extends Artifact {
	type: ArtifactType.TableList,
	environment: number,
	database: string,
	list: { name: string, type: string }[]
}

export interface DescriptiveFieldList extends Artifact {
	type: ArtifactType.DescriptiveFieldList,
	stream: number,
	field: string,
	list: { name: string, type: string }[]
}

export interface FieldDescriptionList extends Artifact {
	type: ArtifactType.FieldDescriptionList,
	stream: number,
	field: string,
	list: any[]
}

export interface ArtifactQuery {
	type: ArtifactType,
	environment?: number,
	stream?: number,
	database?: string,
	table?: string,
	field?: string,
	forceRefetch?: boolean
}

export enum ArtifactType {
	'DatabaseList' = 1,
	'TableList' = 2,
	'DescriptiveFieldList' = 3,
	'FieldDescriptionList' = 4
}
