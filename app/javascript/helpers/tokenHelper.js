import { useSelector } from "react-redux";

const tokenHeader = () => {
  const authToken = useSelector((state) => state.auth.token);
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export default tokenHeader;
