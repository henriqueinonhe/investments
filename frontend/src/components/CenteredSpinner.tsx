import React from "react";
import styled from "styled-components";
import { Spinner } from "./Spinner";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CenteredSpinner = React.memo(() => {
  return (
    <Container>
      <Spinner />
    </Container>
  );
});

CenteredSpinner.displayName = "CenteredSpinner";