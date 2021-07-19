import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Container = styled.div`
  z-index: 9999;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
`;

export interface ModalProps {
  children : React.ReactNode;
}

export function Modal(props : ModalProps) : JSX.Element {
  const {
    children
  } = props;

  useEffect(() => {
    const body = document.querySelector("body")!;
    body.style.position = "fixed";
    body.style.overflowY = "scroll";
    body.style.width = "100%";

    return () => {
      body.style.position = "relative";
    };
  }, []);

  return ReactDOM.createPortal(
    <Container>
      {children}
    </Container>,
    document.querySelector("#modalContainer")!
  );
}