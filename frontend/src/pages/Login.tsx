import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px;
  height: 100%;
`;

const Title = styled.h2`
  font-size: 44px;
  text-align: center;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: 40px;
`;

export function Login() : JSX.Element {
  const { loginWithRedirect } = useAuth0();
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t("Investments")}</Title>

      <LoginButton 
        onClick={loginWithRedirect}
      >
        {t("Login")}
      </LoginButton>
    </Container>
  );
}