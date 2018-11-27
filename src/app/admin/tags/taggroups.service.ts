import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TagGroup } from './taggroup.models';

@Injectable( {
	providedIn: 'root'
} )
export class TaggroupsService {
	private baseUrl = '/api/tag';

	constructor( private http: HttpClient ) { }

	public load = () => this.http.get<TagGroup[]>( this.baseUrl );
	public create = ( payload: TagGroup ) => this.http.post<TagGroup>( this.baseUrl, payload );
	public update = ( payload: TagGroup ) => this.http.put<TagGroup>( this.baseUrl, payload );
	public delete = ( payload: number ) => this.http.delete( this.baseUrl + '/' + payload );
}
