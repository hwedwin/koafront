/**
 * 用户redux
 */
import {createStore} from 'redux';

//行为类型
const INIT_MEMBER = 'INIT_MEMBER';
const LOGIN_OUT = 'LOGIN_OUT';
const INIT_SWIPERS = 'INIT_SWIPERS';
const INIT_SPECIALS = 'INIT_SPECIALS';
const INIT_RECS = 'INIT_RECS';
const INIT_DATA_BRAND = 'INIT_DATA_BRAND';

//reducer
function reducer(state,action) {
	if (!state) {
		state = {
			loginStatus: false,
			member: {
				isPaidAgent: false
			},
			paramAgentId: 'top',
			swipers: [],
			specials: [],
			recs: [],
			dataBrand: []
		}
	}
	switch(action.type){
		case INIT_MEMBER:
			action.member.isPaidAgent = action.member.isAgent == '1' && action.member.isPay == '1';
			return {
				...state,
				loginStatus: true,
				member: action.member
			};
		case LOGIN_OUT:
			return {
				...state,
				loginStatus: false
			};
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
		case INIT_DATA_BRAND: 
			return {
				...state,
				dataBrand: action.dataBrand
			};
		default: 
			return state;
	}
}

export default createStore(reducer);

//行为建造器
export const initMember = (member) => {
	return {type: INIT_MEMBER,member};
}

export const loginOut = () => {
	return {type: LOGIN_OUT};
}

export const initSwipers = (swipers) => {
	return {type: INIT_SWIPERS,swipers};
}

export const initSpecials = (specials) => {
	return {type: INIT_SPECIALS,specials};
}

export const initRecs = (recs) => {
	return {type: INIT_RECS,recs};
}

export const initDataBrand = (dataBrand) => {
	return {type: INIT_DATA_BRAND,dataBrand};
}
