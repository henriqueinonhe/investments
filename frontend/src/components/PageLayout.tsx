import React from "react";
import styled from "styled-components";
import { Profile } from "./Profile";

const Container = styled.div`
  padding: 10px;
  padding-bottom: 60px;
`;

export interface PageLayoutProps {
  children : React.ReactNode;
}

export function PageLayout(props : PageLayoutProps) : JSX.Element {
  const {
    children
  } = props;

  return (
    <Container>
      <Profile />

      {children}
    </Container>
  );
}