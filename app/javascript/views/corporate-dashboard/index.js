import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import UserCard from './UserCard';
import { gridSpacing } from 'store/constant';
import tokenHeader from 'helpers/tokenHelper';
import userData from 'helpers/userHelper';
import { useSelector } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState({activeUser: 0, pendingUser: 0});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const userToken = tokenHeader();
  const currentUser = userData();

  const fetchData = async () => {
    try {
      console.log(`Token : ${userToken}`);
      console.log(`isAuthenticated : ${isAuthenticated}`);
      console.log(`token : ${token}`);
      console.log(`cardUser : ${currentUser.corporate_id}`);
      const activeUser = await axios.get(`/api/v1/users?corporate_flag=true&corporate_id=${currentUser.corporate_id}`, userToken);  
      const pendingUser = await axios.get(`/api/v1/users?corporate_flag=false&corporate_id=${currentUser.corporate_id}`, userToken); 
      setDatas({activeUser: activeUser.data.items.length, pendingUser:  pendingUser.data.items.length});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData()
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <UserCard isLoading={isLoading} count={datas.activeUser} flag='Active'/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <UserCard isLoading={isLoading} count={datas.pendingUser} flag='Pending'/>
          </Grid>
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
