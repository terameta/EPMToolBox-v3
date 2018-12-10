import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import { Notification, NotificationType } from 'src/app/notification/notification.models';
import { getURL } from 'src/app/shared/router.selectors';
import { getAutoShowNotificationsAndOnlyError } from 'src/app/shared/shared.selectors';
import { AutoShowNotificationsToggle, AutoShowNotificationsOnlyErrorToggle } from 'src/app/shared/shared.actions';
import { combineLatest, map, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationState } from 'src/app/notification/notification.state';
import { NotificationDismissWithUUID, NotificationShowDetail } from 'src/app/notification/notification.actions';
import { RouterGo } from 'src/app/shared/router.actions';


@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
} )
export class NavbarComponent implements OnInit {
	public url$: Observable<string>;
	public notifications$: Observable<Notification[]>;
	public notificationType = NotificationType;
	public shouldShowNotifications = false;

	public notificationAutoShow = false;
	public notificationAutoShowOnlyError = false;

	public sharedState$ = this.store.pipe( select( 'shared' ) );

	public currentFeature$ = this.sharedState$.pipe( map( ss => ss.currentFeature ), map( cf => cf ? cf : '' ) );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
		this.notifications$ = this.store.pipe( select( 'notification' ), map( ( ns: NotificationState ) => ns.notifications ) );
		this.url$ = this.store.pipe( select( getURL ) );
		this.notifications$.pipe(
			combineLatest( this.store.pipe( select( getAutoShowNotificationsAndOnlyError ) ) )
		).subscribe( ( [notifications, showState] ) => {
			this.notificationAutoShow = showState.autoShow;
			this.notificationAutoShowOnlyError = showState.isOnlyError;
			if ( this.notificationAutoShow ) {
				if ( this.notificationAutoShowOnlyError ) {
					if ( notifications.filter( n => n.type === NotificationType.Error || n.type === NotificationType.FatalError ).length ) this.shouldShowNotifications = true;
				} else {
					if ( notifications.length ) this.shouldShowNotifications = true;
				}
			}
			if ( notifications.length === 0 ) this.shouldShowNotifications = false;
		} );
	}

	public notificationAutoShowOnChange = () => {
		this.store.dispatch( new AutoShowNotificationsToggle() );
		return false;
	}

	public notificationAutoShowOnlyErrorOnChange = () => {
		this.store.dispatch( new AutoShowNotificationsOnlyErrorToggle() );
		return false;
	}

	public notificationDismiss = ( uuid: string ) => this.store.dispatch( new NotificationDismissWithUUID( uuid ) );
	public notificationShowDetail = ( uuid: string ) => this.store.dispatch( new NotificationShowDetail( uuid ) );
	public number2Array = ( length ) => ( new Array( length ) );
	public url2Feature = ( url: string ) => url.split( '/' ).splice( 0, 3 ).join( '/' );

	public selectionChanged = ( $event ) => this.store.dispatch( new RouterGo( { path: ['admin', $event.target.value] } ) );

}
