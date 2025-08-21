import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import config from "../../config/Config";
import styles from "./Auth.module.css";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [role, setRole] = useState("user");
  const [roleError, setRoleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Redirect after success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const onChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.length < 4 || newUsername.length > 15) {
      setUsernameError("Username must be between 4 and 15 characters.");
    } else {
      setUsernameError("");
    }
  };

  const onChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length < 6 || newPassword.length > 20) {
      setPasswordError("Password must be between 6 and 20 characters.");
    } else {
      setPasswordError("");
    }
  };

  const onChangeEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError("");
    }
  };

  const onChangeRole = (e) => setRole(e.target.value);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (usernameError || passwordError || emailError || roleError) return;
    setLoading(true);
    setSuccessMessage("");
    try {
      const newUser = { username, password, email, role };
      const url = config.base_url + "/api/auth/register";
      const registerRes = await Axios.post(url, newUser);
      if (registerRes.data.status === "fail") {
        const { message, type } = registerRes.data;
        setUsernameError(type === "username" ? message : "");
        setPasswordError(type === "password" ? message : "");
        setEmailError(type === "email" ? message : "");
        setRoleError(type === "role" ? message : "");
        if (!type) {
          setUsernameError(message);
          setPasswordError(message);
          setEmailError(message);
          setRoleError(message);
        }
      } else if (registerRes.status === 201) {
        setSuccessMessage("Registration successful! Redirecting to login...");
      }
    } catch (err) {
      setUsernameError("");
      setPasswordError("");
      setEmailError("");
      setRoleError("");
    } finally {
      setLoading(false);
    }
  };

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
        <Box width="100%" maxWidth={400} boxShadow={1}>
          <Card className={styles.paper}>
            <CardContent>
              <Typography component="h1" variant="h5">
                Register
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  error={emailError.length > 0}
                  helperText={emailError}
                  value={email}
                  onChange={onChangeEmail}
                  disabled={loading}
                />
                <FormControl fullWidth margin="normal" disabled={loading}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={role}
                    onChange={onChangeRole}
                    label="Role"
                    error={roleError.length > 0}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="guest">Guest</MenuItem>
                  </Select>
                </FormControl>
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.submit}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </Box>
              </form>
              <Grid container justify="center">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account?
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

export default Register;
