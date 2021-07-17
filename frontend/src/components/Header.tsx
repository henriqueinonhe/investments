import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Container = styled.header`
background-color: ${props => props.theme.primaryColor};
padding: 20px 0;
`;

const Title = styled.h1`
text-align: center;
`;

export const Header = React.memo(() => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t("Investments Wallet")}</Title>
    </Container>
  );
});

Header.displayName = "Header";