/**
 * 用户redux
 */
import {createStore} from 'redux';

//行为类型
const INIT_SWIPERS = 'INIT_SWIPERS';
const INIT_SPECIALS = 'INIT_SPECIALS';
const INIT_RECS = 'INIT_RECS';

//reducer
function reducer(state,action) {
	if (!state) {
		state = {
			swipers: [],
			specials: [],
			recs: []
		}
	}
	switch(action.type){
		case INIT_SWIPERS:
			return {
				...state,
				swipers: action.swipers
			};
		case INIT_SPECIALS:
			return {
				...state,
				specials: action.specials
			};
		case INIT_RECS:
			return {
				...state,
				recs: action.recs
			};
		default: 
			return state;
	}
}

export default createStore(reducer);

//行为建造器
export const initSwipers = (swipers) => {
	return {type: INIT_SWIPERS,swipers};
}

export const initSpecials = (specials) => {
	return {type: INIT_SPECIALS,specials};
}

export const initRecs = (recs) => {
	return {type: INIT_RECS,recs};
}
