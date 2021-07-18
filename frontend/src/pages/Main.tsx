import { asyncCallback, useIsMounted } from "@henriqueinonhe/react-hooks";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";
import { FormModal } from "../components/FormModal";
import { Header } from "../components/Header";
import { InvestmentForm } from "../components/InvestmentForm";
import { InvestmentsDisplay } from "../components/InvestmentsDisplay";
import { CreateInvestmentData, InvestmentsService } from "../services/InvestmentsService";

const Container = styled.div``;

const AddInvestmentButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


const AddInvestmentButton = styled(Button)`
  padding: 10px;
  width: 100%;
  margin: 0 12px;
`;

const InvestmentsDisplayContainer = styled.div`
  margin-top: 20px;
`;

export function Main() : JSX.Element {
  const { t } = useTranslation();
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const isMounted = useIsMounted();

  function handleAddInvestmentButtonClicked() : void {
    setShowAddInvestmentModal(true);
  }

  function addInvestment(investment : CreateInvestmentData) : void {
    asyncCallback(isMounted, async () => {
      await InvestmentsService.createInvestment(investment);
    }, () => {
      setShowAddInvestmentModal(false);
    });
  }

  return (
    <Container>
      <Header />

      <AddInvestmentButtonRow>
        <AddInvestmentButton
          onClick={handleAddInvestmentButtonClicked}
        >
          {t("Add Investment")}
        </AddInvestmentButton>
      </AddInvestmentButtonRow>
      
      <InvestmentsDisplayContainer>
        <InvestmentsDisplay />
      </InvestmentsDisplayContainer>

      {
        showAddInvestmentModal &&
        <FormModal
          title={t("Add Investment")}
        >
          <InvestmentForm 
            onCancel={() => setShowAddInvestmentModal(false)}
            onSave={addInvestment}
          />
        </FormModal>
      }
    </Container>
  );
}