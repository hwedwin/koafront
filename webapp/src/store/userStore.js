/**
 * 用户redux
 */
import {createStore} from 'redux';

//action types
const INIT_MEMBER = 'INIT_MEMBER';
const LOGIN_OUT = 'LOGIN_OUT';
const INIT_AGENT = 'INIT_AGENT';

//reducer
function reducer(state,action) {
	if (!state) {
		state = {
			loginStatus: false,
			member: {},
			agentId: null,
		}
	}
	switch(action.type){
		case INIT_MEMBER:
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
		case INIT_AGENT: 
			return {
				...state,
				agentId: action.agentId
			};
		default: 
			return state;
	}
}

export default createStore(reducer);

//action creators
export const initMember = (member) => {
	return {type: INIT_MEMBER,member};
}

export const loginOut = () => {
	return {type: LOGIN_OUT};
}

export const initAgentId = (agentId) => {
	return {type: INIT_AGENT,agentId};
}
