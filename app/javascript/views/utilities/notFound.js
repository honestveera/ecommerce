import React from 'react';
import { Box, Button, Container, Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid';

const NotFoundPage = () => {
  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid xs={6}>
          <img
            src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
            alt=""
            width={500} height={250}
          />
           <Typography variant="h6">
            The page you are looking for doesnot exist.
          </Typography>
          <Link href="/">
            <Typography variant="h6">
              Back Home
            </Typography>
         </Link>
        </Grid>
      </Grid>
    </Container>
  </Box>
  );
};

export default NotFoundPage;
