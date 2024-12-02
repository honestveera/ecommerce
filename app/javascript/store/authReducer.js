import * as actionTypes from './actions';

const expires = JSON.parse(localStorage.getItem('expires'));

const getDataWithExpirationCheck = (expires) => {
  const currentTime = new Date().getTime();
  // Update time each application load
  if ((expires !== null) && (currentTime < expires.expires)) {
    const storedToken = localStorage.getItem('authToken');
    const data = localStorage.getItem('data');
    localStorage.setItem('expires', JSON.stringify({expires: currentTime + 3600000}))

    return {
      isAuthenticated: !!storedToken,
      token: storedToken  || null,
      data: JSON.parse(data)
    }
  } else {
    // Data has expired, remove it
    localStorage.removeItem('authToken');
    localStorage.removeItem('data');
    localStorage.removeItem('expires');

    return {
      isAuthenticated: false,
      token: null,
      data: {}
    }
  }
}

const initialState = getDataWithExpirationCheck(expires);

const authReducer = (state = initialState, action) => {   
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        token: action.token,
        data: JSON.parse(action.data)
      };
    case 'LOGOUT':
      return  {
        isAuthenticated: false,
        token:  null,
        data: {}
      };
    default:
      return state;
  }
};

export default authReducer;