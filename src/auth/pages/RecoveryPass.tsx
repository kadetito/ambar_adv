import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TextField, Button } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { AuthLayout } from "../layout/AuthLayout";

export const RecoveryPass = () => {
  return (
    <AuthLayout>
      <form>
        <Row className="mb-4">
          <Col>
            <TextField
              label="E-mail"
              type="email"
              placeholder="E-mail"
              fullWidth
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Button variant="contained" placeholder="Password" fullWidth>
              Recuperar password
            </Button>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Link to="/auth/login">Ir al login</Link>
          </Col>
        </Row>
      </form>
    </AuthLayout>
  );
};
