import { FieldDescriptionItem } from 'shared/models/artifacts.models';
import { StreamExportHPDBSelectionDefinitionItem } from 'shared/models/streams.models';

export const findMember = ( memberList: FieldDescriptionItem[], memberName: string ) => memberList.filter( mbr => mbr.RefField === memberName );
export const isLevel0 = ( memberList: FieldDescriptionItem[], memberName: string ) => memberList.findIndex( element => element.Parent === memberName ) < 0;
export const findChildren = ( memberList: FieldDescriptionItem[], memberName: string ) => memberList.filter( mbr => mbr.Parent === memberName );
export const findDescendants = ( memberList: FieldDescriptionItem[], memberName: string ) => findDescendantsAction( memberList, memberName );
const findDescendantsAction = ( memberList: FieldDescriptionItem[], member: string, currentList: FieldDescriptionItem[] = [] ) => {
	const children = findChildren( memberList, member );
	children.forEach( child => {
		currentList.push( child );
		findDescendantsAction( memberList, child.RefField, currentList );
	} );
	return currentList;
};
export const findLevel0 = ( memberList: FieldDescriptionItem[], memberName: string ) => findDescendants( memberList, memberName ).filter( element => isLevel0( memberList, element.RefField ) );
export const countMembers = ( memberList: FieldDescriptionItem[], member: StreamExportHPDBSelectionDefinitionItem ) => {
	let count = 0;
	if ( member && memberList && memberList.length > 0 ) {
		if ( member.function === 'member' ) {
			count = 1;
		}
		if ( member.function === 'level0descendants' ) {
			count = findLevel0( memberList, member.selection ).length;
		}
		if ( member.function === 'children' ) {
			count = findChildren( memberList, member.selection ).length;
		}
		if ( member.function === 'ichildren' ) {
			count = findChildren( memberList, member.selection ).length + 1;
		}
		if ( member.function === 'descendants' ) {
			count = findDescendants( memberList, member.selection ).length;
		}
		if ( member.function === 'idescendants' ) {
			count = findDescendants( memberList, member.selection ).length + 1;
		}
	}
	return count;
};
export const findMembers = ( memberList: any[], type: string, member: string ) => {
	if ( member ) {
		if ( type === 'member' ) return findMember( memberList, member );
		if ( type === 'level0descendants' ) return findLevel0( memberList, member );
		if ( type === 'children' ) return findChildren( memberList, member );
		if ( type === 'ichildren' ) return [...findMember( memberList, member ), ...findChildren( memberList, member )];
		if ( type === 'descendants' ) return findDescendants( memberList, member );
		if ( type === 'idescendants' ) return [...findMember( memberList, member ), ...findDescendants( memberList, member )];
	}
	return null;
};

export const getPBCSReadDataSelections = ( payload: { selectedMember: string, selectionType: string } ): string => {
	if ( payload.selectionType === 'member' ) return payload.selectedMember;
	if ( payload.selectionType === 'level0descendants' ) return 'ILvl0Descendants(' + payload.selectedMember + ')';
	if ( payload.selectionType === 'children' ) return 'Children(' + payload.selectedMember + ')';
	if ( payload.selectionType === 'ichildren' ) return 'Children(' + payload.selectedMember + '), ' + payload.selectedMember;
	if ( payload.selectionType === 'descendants' ) return 'Descendants(' + payload.selectedMember + ')';
	if ( payload.selectionType === 'idescendants' ) return 'Descendants(' + payload.selectedMember + '), ' + payload.selectedMember;
};
