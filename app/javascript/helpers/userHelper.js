import { useSelector } from "react-redux";

const userData = () => {
  const userData = useSelector((state) => state.auth.data);
  return userData
};

export default userData;
