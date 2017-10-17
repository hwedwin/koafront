/**
 * 用户redux
 */
import {createStore} from 'redux';

//行为类型
const INIT_MEMBER = 'INIT_MEMBER';
const LOGIN_OUT = 'LOGIN_OUT';
const INIT_PARAM_AGENT = 'INIT_PARAM_AGENT';

//reducer
function reducer(state,action) {
	if (!state) {
		state = {
			loginStatus: false,
			member: {
				isPaidAgent: false
			},
			paramAgentId: 'top',
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
		case INIT_PARAM_AGENT: 
			return {
				...state,
				paramAgentId: action.paramAgentId
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

export const initParamAgentId = (agentId) => {
	return {type: INIT_PARAM_AGENT,agentId};
}
