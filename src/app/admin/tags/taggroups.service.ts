import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TagGroup } from './taggroup.models';
import { CloneTarget } from 'shared/models/clone.target';

@Injectable( {
	providedIn: 'root'
} )
export class TagGroupsService {
	private baseUrl = '/api/taggroups';

	constructor( private http: HttpClient ) { }

	public load = () => this.http.get<TagGroup[]>( this.baseUrl );
	public create = ( payload: TagGroup ) => this.http.post<TagGroup>( this.baseUrl, payload );
	public clone = ( payload: CloneTarget ) => this.http.put<TagGroup>( this.baseUrl, payload );
	public update = ( payload: TagGroup ) => this.http.patch<TagGroup>( this.baseUrl, payload );
	public delete = ( payload: number ) => this.http.delete( this.baseUrl + '/' + payload );
}
