import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { Provider } from 'react-redux';
import store from './redux/store';
import AdminDashboard from './admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import CreatePost from './admin/CreatePost';
import AuthPage from './pages/AuthPage';
import Layout from './admin/global/Layout'
import EditPost from './admin/EditPost';
import EditPostUser from './pages/EditPostUser';
import UserDashboard from './user/UserDashboard';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import ManagePosts from './admin/ManagePosts';
import ManageUsers from './admin/ManageUsers';


//HOC
const AdminDashboardHOC = Layout(AdminDashboard);
const CreatePostHOC = Layout(CreatePost);
const EditPostHOC = Layout(EditPost);
const UserDashboardHOC = Layout(UserDashboard);
const ManagePostsHOC = Layout(ManagePosts);
const ManageUsersHOC = Layout(ManageUsers);

const App = () => {
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <ProSidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<AuthPage />} />
              <Route path='/register' element={<AuthPage />} />
              <Route path='/search' element={<SearchResults />} />
              <Route path='/post/:id' element={<SinglePost />} />
              <Route path='/post/edit/:id' element={<EditPostUser />} />
              <Route path='/profile' element={<UserRoute><Profile /></UserRoute>} />
              <Route path='*' element={<NotFound />} />
              <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboardHOC /></AdminRoute>} />
              <Route path='/admin/posts' element={<AdminRoute><ManagePostsHOC /></AdminRoute>} />
              <Route path='/admin/users' element={<AdminRoute><ManageUsersHOC /></AdminRoute>} />
              <Route path='/admin/post/create' element={<AdminRoute><CreatePostHOC /></AdminRoute>} />
              <Route path='/admin/post/edit/:id' element={<AdminRoute><EditPostHOC /></AdminRoute>} />
              <Route path='/user/dashboard' element={<UserRoute><UserDashboardHOC /></UserRoute>} />
            </Routes>
          </BrowserRouter>
        </ProSidebarProvider>

      </Provider>
    </>
  )
}

export default App