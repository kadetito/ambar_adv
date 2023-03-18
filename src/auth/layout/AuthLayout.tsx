import { FC } from "react";

import { Card, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <Container className="overflow-hidden min-vh-100 d-flex align-items-center justify-content-center">
      <motion.section
        style={{ overflow: "hidden" }}
        initial={{ overflow: "hidden", opacity: 0, x: 1000 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.3, ease: "circOut" },
        }}
        exit={{
          opacity: 0,
          x: -1000,
          transition: { duration: 0.3, ease: "circIn" },
        }}
      >
        <Row>
          <Col>
            <Card>
              <Card.Body>{children}</Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.section>
    </Container>
  );
};
