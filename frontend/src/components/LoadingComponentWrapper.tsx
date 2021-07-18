import React from "react";
import { CenteredSpinner } from "./CenteredSpinner";

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
          <CenteredSpinner /> :
          children
      }
    </>
  );
}