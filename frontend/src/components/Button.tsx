import React from "react";
import styled from "styled-components";
import { darken, opacify, transparentize } from "polished";

interface ContainerProps {
  variant : "primary" | "secondary";
}

const Container = styled.button<ContainerProps>`
  padding: 12px;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.primaryColor};
  color: ${props => props.variant === "primary" ? "white" : props.theme.primaryColor};
  background-color: ${props => props.variant === "primary" ? props.theme.primaryColor : "white"};
  cursor: pointer;

  &:active {
    background-color: ${props => props.variant === "primary" ? 
    darken(0.1, props.theme.primaryColor) : 
    opacify(0.2, transparentize(1, props.theme.primaryColor))}
  }

  &:hover {
    background-color: ${props => props.variant === "primary" ? 
    darken(0.05, props.theme.primaryColor) : 
    opacify(0.1, transparentize(1, props.theme.primaryColor))}
  }
`;

export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  variant ?: "primary" | "secondary";
}

//NOTE Maybe should forward ref
export function Button(props : ButtonProps) : JSX.Element {
  const {
    variant = "primary",
    children,
    ...inheritedProps
  } = props;

  return (
    <Container 
      {...inheritedProps} 
      variant={variant}
    >
      {children}
    </Container>
  );
}
