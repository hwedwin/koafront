/**
 * 用户redux
 */
import {createStore} from 'redux';

//action types
const INIT_MEMBER = 'INIT_MEMBER'
const LOGIN_OUT = 'LOGIN_OUT'

//reducer
function reducer(state,action) {
	if (!state) {
		state = {
			loginStatus: false,
			member: {}
		}
	}
	switch(action.type){
		case INIT_MEMBER:
			return {
				loginStatus: true,
				member: action.member
			}
		case LOGIN_OUT:
			return {
				loginStatus: false
			}
		default: 
			return state
	}
}

export default createStore(reducer);

//action creators
export const initMember = (member) => {
	return {type: INIT_MEMBER,member}
}

export const loginOut = () => {
	return {type: LOGIN_OUT}
}
