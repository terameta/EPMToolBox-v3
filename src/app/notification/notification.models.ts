import { JSONDeepCopy } from 'shared/utilities/utility.functions';
import { v4 as uuid } from 'uuid';

export interface Notification {
	uuid: string,
	title: string,
	message: string,
	type: NotificationType
}

export const getBaseNotification = (): Notification => {
	return { uuid: uuid(), title: '', message: '', type: NotificationType.Info };
};

export enum NotificationType {
	Info = 0,
	Progress = 1,
	BlockingProgress = 2,
	Warning = 3,
	Error = 4,
	FatalError = 5,
	Success = 6
}
