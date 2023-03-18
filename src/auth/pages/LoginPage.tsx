import { Link } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { AuthLayout } from "../layout/AuthLayout";
import { useAppDispatch, useAuthStore, useForm } from "../../hooks/";
import { Profile } from "../../models/profile";
import { useEffect } from "react";
import Swal from "sweetalert2";

const loginFormFields = {
  loginEmail: "rpenya@syntonize.com",
  loginPassword: "bSPmjjuCC*7W",
};

export const LoginPage = () => {
  const { startLogin, errorMessage } = useAuthStore();
  const { loginEmail, loginPassword, onInputChange } = useForm(loginFormFields);

  const onSubmit = (event: any) => {
    event.preventDefault();
    startLogin({ username: loginEmail, password: loginPassword });
  };

  useEffect(() => {
    if (errorMessage) {
      Swal.fire("Error en la autenticación", errorMessage, "error");
    }
  }, [errorMessage]);

  return (
    <AuthLayout>
      <form onSubmit={onSubmit}>
        <Row className="mb-4">
          <Col>
            <TextField
              label="E-mail"
              type="email"
              name="username"
              placeholder="E-mail"
              fullWidth
              value={loginEmail}
              onChange={onInputChange}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <TextField
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              fullWidth
              value={loginPassword}
              onChange={onInputChange}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Button
              type="submit"
              variant="contained"
              placeholder="Password"
              fullWidth
            >
              Login
            </Button>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Link to="/auth/recovery">Recuperar contraseña</Link>
          </Col>
        </Row>
      </form>
    </AuthLayout>
  );
};
