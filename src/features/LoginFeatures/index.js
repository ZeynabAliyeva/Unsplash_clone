import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import "./index.css";

const LoginFeatures = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "zeynabma@code.edu.az",
      password: "12345",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
      window.localStorage.setItem("id", data.payload._id);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper className="loginPaper">
      <Typography classes={{ root: "title" }} variant="h5">
        Log In
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
        <TextField
          type="email"
          className="field"
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Add Email" })}
          fullWidth
        />
        <TextField
          className="field"
          label="Password"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Add password" })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Log In
        </Button>
      </form>
    </Paper>
  );
};

export default LoginFeatures;
