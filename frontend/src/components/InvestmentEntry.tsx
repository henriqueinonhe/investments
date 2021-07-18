import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Investment, InvestmentsService } from "../services/InvestmentsServices";
import { FormModal } from "./FormModal";
import { InvestmentForm } from "./InvestmentForm";

const Container = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 12px;
`;

const InvestmentBaseField = styled.div``;

const InvestmentTypeField = styled(InvestmentBaseField)`
`;

const InvestmentIdentifierField = styled(InvestmentBaseField)`
  margin-left: 12px;
  /* overflow-wrap: anywhere; */
  text-overflow: ellipsis;
  overflow: hidden;
`;

const InvestmentValueField = styled(InvestmentBaseField)`
  margin-left: 12px;
  white-space: nowrap;
`;

export interface InvestmentyEntryProps {
  investment : Investment;
}

export const InvestmentEntry = React.memo((props : InvestmentyEntryProps) => {
  const {
    investment
  } = props;

  const [showEditInvestmentModal, setShowEditInvestmentModal] = useState(false);

  const { t } = useTranslation();

  const displayableInvestmentType = InvestmentsService.displayableInvestmentType(investment.type);

  return (
    <Container
      //TEMP!
      onClick={() => setShowEditInvestmentModal(true)}
    >
      <InvestmentTypeField>{t(displayableInvestmentType)}</InvestmentTypeField>
      <InvestmentIdentifierField>{investment.identifier}</InvestmentIdentifierField>
      {/* FORMAT CURRENCY! */}
      <InvestmentValueField>{`R$ ${investment.value.toFixed(2).toString()}`}</InvestmentValueField>

      {
        showEditInvestmentModal &&
        <FormModal
          title={t("Edit Investment")}
        >
          <InvestmentForm 
            onCancel={() => { setShowEditInvestmentModal(false);}}
            onSave={investment => console.log(investment)}
            investment={investment}
          />
        </FormModal>
      }
    </Container>
  );
});

InvestmentEntry.displayName = "InvestmentEntry";