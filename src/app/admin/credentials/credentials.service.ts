import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credential } from './credential.models';

@Injectable( {
	providedIn: 'root'
} )
export class CredentialsService {
	private baseUrl = '/api/credentials';

	constructor( private http: HttpClient ) { }

	public load = () => this.http.get<Credential[]>( this.baseUrl );
	public create = ( payload: Credential ) => this.http.post<Credential>( this.baseUrl, payload );
	public update = ( payload: Credential ) => this.http.put<Credential>( this.baseUrl, payload );
	public delete = ( payload: number ) => this.http.delete( this.baseUrl + '/' + payload );
	public reveal = ( payload: number ) => this.http.get<{ clearPassword: string }>( this.baseUrl + '/reveal/' + payload );
}
