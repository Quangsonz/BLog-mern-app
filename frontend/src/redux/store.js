// file này dùng để cấu hình cửa hàng Redux cho ứng dụng quản lý trạng thái toàn cục
// bao gồm việc kết hợp các reducers, thiết lập trạng thái ban đầu và áp dụng middleware cần thiết.
// redux là một thư viện quản lý trạng thái phổ biến trong các ứng dụng JavaScript, đặc biệt là với React.
// Người dùng thao tác → Component gọi action → Action creator dispatch action → Reducer cập nhật state → Store lưu state mới → Component nhận state mới và cập nhật giao diện.

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { userReducerLogout, userReducerProfile, userReducerSignIn, userReducerSignUp } from './reducers/userReducer';
import { notificationsReducer } from './reducers/notificationReducer';


//combine reducers
const reducer = combineReducers({
    signIn: userReducerSignIn,
    signUp: userReducerSignUp,
    logOut: userReducerLogout,
    userProfile: userReducerProfile,
    notifications: notificationsReducer
});


//initial state
let initialState = {
    signIn: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    }

};
const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store;