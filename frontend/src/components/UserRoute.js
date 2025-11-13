import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.signIn);
  // Allow both user and admin to access
  return userInfo ? children : <Navigate to="/" />;
};

export default UserRoute;
