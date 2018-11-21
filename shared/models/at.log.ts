export interface ATLog {
	id: number,
	parent: number,
	start: Date,
	end: Date,
	details: string,
	refid: number,
	reftype: string
}

export interface ATLogSubject {
	[key: number]: ATLog
}

export interface ATLogConcept {
	subject: ATLogSubject,
	ids: number[]
}

export const ATLogConceptDefault = (): ATLogConcept => ( { subject: {}, ids: [] } );
