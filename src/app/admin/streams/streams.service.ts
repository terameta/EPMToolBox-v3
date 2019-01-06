import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CloneTarget } from 'shared/models/clone.target';
import { Stream } from 'shared/models/streams.models';

@Injectable( {
	providedIn: 'root'
} )
export class StreamsService {
	private baseUrl = '/api/streams';

	constructor( private http: HttpClient ) { }

	public load = () => this.http.get<Stream[]>( this.baseUrl );
	public create = ( payload: Stream ) => this.http.post<Stream>( this.baseUrl, payload );
	public clone = ( payload: CloneTarget ) => this.http.put<Stream>( this.baseUrl, payload );
	public update = ( payload: Stream ) => this.http.patch<Stream>( this.baseUrl, payload );
	public delete = ( payload: number ) => this.http.delete( this.baseUrl + '/' + payload );
}
