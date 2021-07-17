import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Header } from "../components/Header";
import { InvestmentsDisplay } from "../components/InvestmentsDisplay";

const Container = styled.div``;

const AddInvestmentButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


const AddInvestmentButton = styled.button`
  padding: 10px;

`;

const InvestmentsDisplayContainer = styled.div``;

export function Main() : JSX.Element {
  const { t } = useTranslation();

  return (
    <Container>
      <Header />

      <AddInvestmentButtonRow>
        <AddInvestmentButton>
          {t("Add Investment")}
        </AddInvestmentButton>
      </AddInvestmentButtonRow>
      
      <InvestmentsDisplayContainer>
        <InvestmentsDisplay />
      </InvestmentsDisplayContainer>
    </Container>
  );
}