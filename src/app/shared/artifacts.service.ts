import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArtifactQuery, Artifact } from 'shared/models/artifacts.models';

@Injectable( {
	providedIn: 'root'
} )
export class ArtifactsService {
	private baseUrl = '/api/artifacts';

	constructor( private http: HttpClient ) { }

	public load = ( payload: ArtifactQuery ) => this.http.post<Artifact>( this.baseUrl + '/load', payload );
}
