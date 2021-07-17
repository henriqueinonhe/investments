import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Line = styled.div`
  border-bottom: 2px solid black;
  flex-grow: 1;
`;

const DateField = styled.div`
  margin: 0 12px;
  font-weight: bold;
`;

export interface DateDividerProps {
  children : string;
}

export const DateDivider = React.memo((props : DateDividerProps) => {
  const {
    children
  } = props;

  return (
    <Container>
      <Line />
      <DateField>{children}</DateField>
      <Line />
    </Container>
  );
});

DateDivider.displayName = "DateDivider";