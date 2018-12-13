import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Observable } from 'rxjs';
import { Notification, NotificationType } from 'src/app/notification/notification.models';
import { getURL } from 'src/app/shared/router.selectors';
import { getAutoShowNotificationsAndOnlyError } from 'src/app/shared/shared.selectors';
import { AutoShowNotificationsToggle, AutoShowNotificationsOnlyErrorToggle, TagsChanged } from 'src/app/shared/shared.actions';
import { combineLatest, map, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { NotificationState } from 'src/app/notification/notification.state';
import { NotificationDismissWithUUID, NotificationShowDetail } from 'src/app/notification/notification.actions';
import { RouterGo } from 'src/app/shared/router.actions';
import { SharedService } from 'src/app/shared/shared.service';


@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
} )
export class NavbarComponent implements OnInit {
	public url$ = this.store.pipe( select( getURL ) );
	public notifications$ = this.store.select( 'notification' ).pipe( map( ( ns: NotificationState ) => ns.notifications ) );
	public notificationType = NotificationType;
	public shouldShowNotifications = false;

	public notificationAutoShow = false;
	public notificationAutoShowOnlyError = false;

	public sharedState$ = this.store.select( 'shared' );

	public currentFeature$ = this.sharedState$.pipe( map( ss => ss.currentFeature ), map( cf => cf ? cf : '' ) );

	public tagGroups$ = this.store.select( 'taggroups' ).pipe( filter( s => s.loaded ), map( s => s.ids.map( i => s.items[i] ) ) );
	public tags$ = this.store.select( 'tags' ).pipe( filter( s => s.loaded ), map( s => s.ids.map( i => s.items[i] ) ) );

	constructor(
		private store: Store<AppState>,
		public ss: SharedService
	) { }

	ngOnInit() {
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

	public notificationAutoShowOnChange = () => this.store.dispatch( new AutoShowNotificationsToggle() );

	public notificationAutoShowOnlyErrorOnChange = () => this.store.dispatch( new AutoShowNotificationsOnlyErrorToggle() );

	public notificationDismiss = ( uuid: string ) => this.store.dispatch( new NotificationDismissWithUUID( uuid ) );
	public notificationShowDetail = ( uuid: string ) => this.store.dispatch( new NotificationShowDetail( uuid ) );
	public number2Array = ( length ) => ( new Array( length ) );
	public url2Feature = ( url: string ) => url.split( '/' ).splice( 0, 3 ).join( '/' );

	public selectionChanged = ( $event ) => this.store.dispatch( new RouterGo( { path: ['admin', $event.target.value] } ) );

	public tagChanged = ( groupid: number, tagid: number ) => this.store.dispatch( new TagsChanged( { groupid, tagid } ) );
}
