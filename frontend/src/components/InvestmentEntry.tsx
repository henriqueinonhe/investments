import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Investment, InvestmentsService } from "../services/InvestmentsServices";

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
`;

export interface InvestmentyEntryProps {
  investment : Investment;
}

export const InvestmentEntry = React.memo((props : InvestmentyEntryProps) => {
  const {
    investment
  } = props;

  const { t } = useTranslation();

  const displayableInvestmentType = InvestmentsService.displayableInvestmentType(investment.type);

  return (
    <Container>
      <InvestmentTypeField>{t(displayableInvestmentType)}</InvestmentTypeField>
      <InvestmentIdentifierField>{investment.identifier}</InvestmentIdentifierField>
      {/* FORMAT CURRENCY! */}
      <InvestmentValueField>{investment.value.toFixed(2)}</InvestmentValueField>
    </Container>
  );
});

InvestmentEntry.displayName = "InvestmentEntry";