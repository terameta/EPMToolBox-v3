import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CloneTarget } from 'shared/models/clone.target';
import { Environment } from 'shared/models/environments.models';

@Injectable( {
	providedIn: 'root'
} )
export class EnvironmentsService {
	private baseUrl = '/api/environments';

	constructor( private http: HttpClient ) { }

	public load = () => this.http.get<Environment[]>( this.baseUrl );
	public create = ( payload: Environment ) => this.http.post<Environment>( this.baseUrl, payload );
	public clone = ( payload: CloneTarget ) => this.http.put<Environment>( this.baseUrl, payload );
	public update = ( payload: Environment ) => this.http.patch<Environment>( this.baseUrl, payload );
	public delete = ( payload: number ) => this.http.delete( this.baseUrl + '/' + payload );
	public verify = ( payload: number ) => this.http.get( `${ this.baseUrl }/verify/${ payload }` );
	public listDatabases = ( payload: number ) => this.http.get( `${ this.baseUrl }/listDatabases/${ payload }` );
	public listTables = ( payload: { environment: number, database: string } ) => this.http.get( `${ this.baseUrl }/listTables/${ payload.environment }/${ payload.database }` );
}
