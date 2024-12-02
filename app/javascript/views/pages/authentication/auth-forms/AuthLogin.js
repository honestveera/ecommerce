import React from "react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "../../../../ui-component/extended/AnimateButton";
//ui-component/extended/AnimateButton
// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { login } from "../../../../store/actions";
import { saveDataWithExpiration } from "../../../../helpers/localStorageHelper";

import Google from "assets/images/icons/social-google.svg";

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const dispatch = useDispatch();

  const googleHandler = async () => {
    console.error("Login");
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginForm = (params, setErrors, setStatus, setSubmitting) => {
    axios
      .post("/api/v1/login", params)
      .then((response) => {
        // Storing token, expiresTime and Data in localstorage
        localStorage.setItem("authToken", response.data.token);
        var jsonString = JSON.stringify(response.data.data);
        localStorage.setItem("data", jsonString);
        saveDataWithExpiration("expires", 60);
        dispatch(login(response.data.token, jsonString));
        setStatus({ success: true });
        setSubmitting(false);
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        console.error("Login Failed:", error);
        setStatus({ success: false });
        setErrors({ submit: error.message });
        setSubmitting(false);
      });
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        {/* <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={googleHandler}
              size="large"
              variant="outlined"
              sx={{
                color: "grey.700",
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100],
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.06129 13.2253L4.31871 15.9975L1.60458 16.0549C0.793457 14.5504 0.333374 12.8292 0.333374 11C0.333374 9.23119 0.763541 7.56319 1.52604 6.09448H1.52662L3.94296 6.53748L5.00146 8.93932C4.77992 9.58519 4.65917 10.2785 4.65917 11C4.65925 11.783 4.80108 12.5332 5.06129 13.2253Z"
                    fill="#FBBB00"
                  />
                  <path
                    d="M21.4804 9.00732C21.6029 9.65257 21.6668 10.3189 21.6668 11C21.6668 11.7637 21.5865 12.5086 21.4335 13.2271C20.9143 15.6722 19.5575 17.8073 17.678 19.3182L17.6774 19.3177L14.6339 19.1624L14.2031 16.4734C15.4503 15.742 16.425 14.5974 16.9384 13.2271H11.2346V9.00732H17.0216H21.4804Z"
                    fill="#518EF8"
                  />
                  <path
                    d="M17.6772 19.3176L17.6777 19.3182C15.8498 20.7875 13.5277 21.6666 11 21.6666C6.93783 21.6666 3.40612 19.3962 1.60449 16.0549L5.0612 13.2253C5.96199 15.6294 8.28112 17.3408 11 17.3408C12.1686 17.3408 13.2634 17.0249 14.2029 16.4734L17.6772 19.3176Z"
                    fill="#28B446"
                  />
                  <path
                    d="M17.8085 2.78892L14.353 5.61792C13.3807 5.01017 12.2313 4.65908 11 4.65908C8.21963 4.65908 5.85713 6.44896 5.00146 8.93925L1.52658 6.09442H1.526C3.30125 2.67171 6.8775 0.333252 11 0.333252C13.5881 0.333252 15.9612 1.25517 17.8085 2.78892Z"
                    fill="#F14336"
                  />
                </svg>
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid> */}
        {/* <Grid item xs={12}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

            <Button
              variant="outlined"
              sx={{
                cursor: "unset",
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`,
              }}
              disableRipple
              disabled
            >
              OR
            </Button>

            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid> */}
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign in with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const params = {
            user: {
              email: values.email,
              password: values.password,
            },
          };
          loginForm(params, setErrors, setStatus, setSubmitting);
          //   if (scriptedRef.current) {
          //     setStatus({ success: true });
          //     setSubmitting(false);
          //   }
          // } catch (err) {
          //   console.error(err);
          //   if (scriptedRef.current) {
          //     setStatus({ success: false });
          //     setErrors({ submit: err.message });
          //     setSubmitting(false);
          //   }
          //  }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address / Username
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  sx={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Forgot Password?
                </Typography>
              </Stack>
            </Stack>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
            <Stack direction="row" spacing={1}>
              <Typography
                variant="subtitle1"
                color="black" // Set color to black
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Link
                  to="/terms-and-conditions"
                  target="_blank"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  Terms And Conditions
                </Link>
              </Typography>
              <Typography
                variant="subtitle1"
                color="black" // Set color to black
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Link
                  to="/privacy-policies"
                  target="_blank"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  Privacy Policies
                </Link>
              </Typography>
            </Stack>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
