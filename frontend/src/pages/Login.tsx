import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { useMyAuth0 } from "../hooks/useMyAuth0";

const Container = styled.div`
  background-color: #DDD;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px;
  background-color: white;
  padding: 30px 30px;
  border-radius: 4px;
`;

const Title = styled.h2`
  font-size: 6vw;
  text-align: center;

  @media (min-width: 425px) {
    font-size: 26px;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: 40px;
  margin-left: 20px;
  margin-right: 20px;
  max-width: 300px;
  font-size: 6vw;

  @media (min-width: 425px) {
    font-size: 26px;
  }
`;

const WalletIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faWallet
})
// eslint-disable-next-line function-paren-newline
)`
  font-size: 15vw;
  margin-bottom: 20px;

  @media (min-width: 425px) {
    font-size: 70px;
  }
`;

export function Login() : JSX.Element {
  const { loginWithRedirect } = useMyAuth0();
  const { t } = useTranslation();

  return (
    <Container>
      <Content>
        <WalletIcon />
        <Title>{t("Investments Wallet")}</Title>

        <LoginButton 
          onClick={loginWithRedirect}
        >
          {t("Login")}
        </LoginButton>
      </Content>
    </Container>
  );
}