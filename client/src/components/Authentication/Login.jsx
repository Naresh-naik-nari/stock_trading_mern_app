import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  CssBaseline,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import config from "../../config/Config";

import styles from "./Auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData, setUser, setRole } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setUsernameError("");
  };

  const onChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setUsernameError("");
    setPasswordError("");
    try {
      const newUser = { username, password };
      const url = config.base_url + "/api/auth/login";
      const res = await Axios.post(url, newUser);
      if (res.data.status === "fail") {
        // Show only relevant error
        if (res.data.message.toLowerCase().includes("username")) {
          setUsernameError(res.data.message);
        } else if (res.data.message.toLowerCase().includes("password")) {
          setPasswordError(res.data.message);
        } else {
          setUsernameError(res.data.message);
          setPasswordError(res.data.message);
        }
      } else {
        setUserData(res.data);
        localStorage.setItem("auth-token", res.data.token);
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          if (res.data.user.role === "admin") {
            navigate("/admin");
          } else if (res.data.user.role === "guest") {
            navigate("/guest");
          } else {
            navigate("/");
          }
        }, 1500);
      }
    } catch (err) {
      setUsernameError("");
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.background}>
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Box width="70vh" boxShadow={1}>
          <Card className={styles.paper}>
            <CardContent>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              {successMessage && (
                <Typography color="primary" align="center" style={{ marginBottom: 10 }}>
                  {successMessage}
                </Typography>
              )}
              <form className={styles.form} onSubmit={onSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  error={usernameError.length > 0}
                  helperText={usernameError}
                  value={username}
                  onChange={onChangeUsername}
                  disabled={loading}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  error={passwordError.length > 0}
                  helperText={passwordError}
                  value={password}
                  onChange={onChangePassword}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <Button onClick={handleShowPassword} tabIndex={-1} style={{ minWidth: 0 }}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    ),
                  }}
                />
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.submit}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Box>
              </form>
              <Grid container justify="center">
                <Grid item>
                  <Link href="/register" variant="body2">
                    Need an account?
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </div>
  );
};

export default Login;
