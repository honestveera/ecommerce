import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import BooksCard from './BooksCard';
import CorporateCard from './CorporateCard';
import UserCard from './UserCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import tokenHeader from 'helpers/tokenHelper';
import { useSelector } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState({booksCount: 0, corporateCount: 0});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const userToken = tokenHeader();

  const fetchData = async () => {
    try {
      console.log(`Token : ${userToken}`);
      console.log(`isAuthenticated : ${isAuthenticated}`);
      console.log(`token : ${token}`);
      const bookResponse = await axios.get('/api/v1/books', userToken); 
      const corporateResponse = await axios.get('/api/v1/corporates', userToken); 
      setDatas({booksCount: bookResponse.data.items.length, corporateCount:  corporateResponse.data.items.length});
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
            <BooksCard isLoading={isLoading} count={datas.booksCount} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <CorporateCard isLoading={isLoading}  count={datas.corporateCount} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <UserCard isLoading={isLoading} />
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
