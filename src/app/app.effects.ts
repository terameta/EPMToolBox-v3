import { AuthEffects } from './auth/auth.effects';
import { InterestEffects } from './shared/interest.effects';
import { NotificationEffects } from './notification/notification.effects';
import { RouterEffects } from './shared/router.effects';
import { SharedEffects } from './shared/shared.effects';
import { TagEffects } from './admin/tags/tag.effects';
import { TagGroupEffects } from './admin/tags/taggroup.effects';
import { CredentialEffects } from './admin/credentials/credentials.effects';
import { EnvironmentEffects } from './admin/environments/environments.effects';
import { StreamEffects } from './admin/streams/streams.effects';

export const AppEffects = [
	AuthEffects,
	CredentialEffects,
	EnvironmentEffects,
	StreamEffects,
	InterestEffects,
	NotificationEffects,
	RouterEffects,
	SharedEffects,
	TagEffects,
	TagGroupEffects
];
