import { combineReducers } from 'redux';

function incDec(state = { leftSpeed: 30, rightSpeed: 30 }, action) {
  switch (action.type) {
    case 'inc-leftspeed':
      return {
        ...state,
        leftSpeed: state.leftSpeed + action.amount,
      };
    case 'dec-leftspeed':
      return {
        ...state,
        leftSpeed: state.leftSpeed - action.amount,
      };
    case 'inc-rightspeed':
      return {
        ...state,
        rightSpeed: state.rightSpeed + action.amount,
      };
    case 'dec-rightspeed':
      return {
        ...state,
        rightSpeed: state.rightSpeed - action.amount,
      };
    default:
      return state;
  }
}

const RClientApp = combineReducers({
  incDec,
});

export default RClientApp;
