import React from "react";
import styled from "styled-components";

const Container = styled.div`
  z-index: 9999;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

export interface ModalProps {
  children : React.ReactChild;
}

export function Modal(props : ModalProps) : JSX.Element {
  const {
    children
  } = props;

  return (
    <Container>
      {children}
    </Container>
  );
}