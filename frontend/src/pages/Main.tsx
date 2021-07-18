import { asyncCallback, useIsMounted } from "@henriqueinonhe/react-hooks";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { InvestmentForm } from "../components/InvestmentForm";
import { InvestmentsDisplay } from "../components/InvestmentsDisplay";
import { Modal } from "../components/Modal";
import { CreateInvestmentData, InvestmentsService } from "../services/InvestmentsServices";

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

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 32px;
  text-align: center;
`;

const ModalContent = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  background-color: white;
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
        <Modal>
          <ModalContent>
            <ModalTitle>{t("Add Investment")}</ModalTitle>
            <InvestmentForm 
              onCancel={() => setShowAddInvestmentModal(false)}
              onSave={addInvestment}
            />
          </ModalContent>
        </Modal>
      }
    </Container>
  );
}