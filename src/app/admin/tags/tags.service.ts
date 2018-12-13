import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from './tag.models';

@Injectable( {
	providedIn: 'root'
} )
export class TagsService {
	private baseUrl = '/api/tags';

	constructor( private http: HttpClient ) { }

	public load = () => this.http.get<Tag[]>( this.baseUrl );
	public create = ( payload: Tag ) => this.http.post<Tag>( this.baseUrl, payload );
	public update = ( payload: Tag ) => this.http.patch<Tag>( this.baseUrl, payload );
	public delete = ( payload: number ) => this.http.delete( this.baseUrl + '/' + payload );
}
