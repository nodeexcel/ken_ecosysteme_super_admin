import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import navbarReducer from './navbarSlice'
import countryReducer from './countryCodeSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    navbar: navbarReducer,
    country: countryReducer,
  },
});

export default store;
