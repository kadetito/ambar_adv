import { useEffect, useRef } from "react";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavigationFixed } from "./NavigationFixed";

export const Header = () => {
  const [sticky, setSticky] = useState({ isSticky: false, offset: 0 });
  const headerRef = useRef<HTMLInputElement>(null);

  const handleScroll = (elTopOffset: any, elHeight: any) => {
    if (window.pageYOffset > elTopOffset + elHeight) {
      setSticky({ isSticky: true, offset: elHeight });
    } else {
      setSticky({ isSticky: false, offset: 0 });
    }
  };

  useEffect(() => {
    var header = headerRef.current?.getBoundingClientRect();
    const handleScrollEvent = () => {
      handleScroll(header?.top, header?.height);
    };

    window.addEventListener("scroll", handleScrollEvent);

    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  return (
    <div style={{ marginTop: sticky.offset }}>
      <div className="header">
        <Container>
          <Row>
            <Col>
              <h1>la Comunidad Legal de élite</h1>
            </Col>
          </Row>
        </Container>
      </div>

      <div
        id="sticky-header"
        className={`navgate${sticky.isSticky ? " sticky" : ""}`}
        ref={headerRef}
      >
        <Container>
          <Row>
            <Col className={`navgate${sticky.isSticky ? "" : " appearslogo"}`}>
              Logotipo aparece
            </Col>

            <Col>Logotipo aparece</Col>
            <Col>Logotipo aparece</Col>
            <Col>
              <NavigationFixed />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
