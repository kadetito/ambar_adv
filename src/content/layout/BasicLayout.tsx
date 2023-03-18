import { FC } from "react";

import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Header } from "../components";
import { NavigationFixed } from "../components/ui/NavigationFixed";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const BasicLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Container>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: "circOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: "circIn" },
          }}
        >
          <Row>
            <Col className="d-flex align-items-center justify-content-center">
              {children}
            </Col>
          </Row>
        </motion.section>
      </Container>
    </>
  );
};
