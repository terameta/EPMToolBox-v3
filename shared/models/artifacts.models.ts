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

export interface ArtifactQuery {
	type: ArtifactType,
	environment?: number,
	stream?: number,
	database?: string,
	table?: string
}

export enum ArtifactType {
	'DatabaseList' = 1,
	'TableList' = 2
}
