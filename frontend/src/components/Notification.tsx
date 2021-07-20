import React, { useEffect } from "react";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import { transparentize } from "polished";

const Container = styled(animated.div)`
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
`;

type NotificationVariantColorMap  = {
  [key in NotificationVariants] : string
};

const notificationVariantColorMap : NotificationVariantColorMap = {
  success: "#b8ffc6",
  warning: "#fdffba",
  error: "#ffbaba"
};

interface ContentProps {
  variant : NotificationVariants;
}

const Content = styled.div<ContentProps>`
  background-color: ${props => transparentize(0.1, notificationVariantColorMap[props.variant])};
  margin: 10px;
  padding: 14px;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
`;

export type NotificationVariants = "success" | "warning" | "error";

export interface NotificationProps {
  variant : NotificationVariants;
  text : string;
}

export const Notification = (props : NotificationProps) : JSX.Element => {
  const {
    text,
    variant
  } = props;

  const [animationProps, animationApi] = useSpring(() => ({
    from: {
      opacity: 0,
      bottom: -120
    },
    to: {
      opacity: 1,
      bottom: 0
    }
  }));

  animationApi.start({
    opacity: 1,
    bottom: 0
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      animationApi.start({
        opacity: 0,
        bottom: -120
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  });


  return (
    <Container style={animationProps}>
      <Content
        variant={variant}
      >
        {text}
      </Content>
    </Container>
  );
};

Notification.displayName = "Notification";