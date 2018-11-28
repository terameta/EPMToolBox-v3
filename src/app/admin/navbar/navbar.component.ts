import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import { getNotifications } from 'src/app/notification/notification.selectors';
import { Notification, NotificationType } from 'src/app/notification/notification.models';


@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
} )
export class NavbarComponent implements OnInit {
	public notifications$: Observable<Notification[]>;
	public notificationType = NotificationType;

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
		this.notifications$ = this.store.pipe( select( getNotifications ) );
		this.notifications$.subscribe( console.log );
	}

}
