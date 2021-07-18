import React from "react";
import { Spinner as BaseSpinner } from "./Spinner";
import styled from "styled-components";

const SpinnerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled(BaseSpinner)`
`;

export interface LoadingComponentWrapperProps {
  isLoading : boolean;
  children : React.ReactNode;
}

export function LoadingComponentWrapper(props : LoadingComponentWrapperProps) : JSX.Element {
  const {
    isLoading,
    children
  } = props;

  return (
    <>
      {
        isLoading ?
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer> :
          children
      }
    </>
  );
}