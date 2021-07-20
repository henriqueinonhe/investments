/* eslint-disable function-paren-newline */
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Investment, InvestmentsService } from "../services/InvestmentsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UpdateInvestmentContext } from "../contexts/UpdateInvestmentContext";
import { DeleteInvestmentContext } from "../contexts/DeleteInvestmentContext";
import { useLocalization } from "../hooks/useLocalization";

const Container = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const LeftColumn = styled.div`
  display: flex;
  align-items: center;
`;

const RightColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
`;

const InvestmentBaseField = styled.div`
  font-size: 12px;

  @media (min-width: 368px) and (max-width: 425px) {
    font-size: 14px;
  }

  @media (min-width: 426px) {
    font-size: 16px;
  }
`;

const InvestmentTypeField = styled(InvestmentBaseField)`
  margin-left: 4px;
  width: 48px;

  @media (min-width: 368px) and (max-width: 425px) {
    font-size: 14px;
    width: 62px;
  }

  @media (min-width: 426px) {
    font-size: 16px;
    width: 70px;
  }
`;

const InvestmentIdentifierField = styled(InvestmentBaseField)`
  margin-left: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 0;
`;

const InvestmentValueField = styled(InvestmentBaseField)`
  margin-left: 12px;
  white-space: nowrap;
`;

const BaseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 16px;
`;

const EditIcon = styled(BaseIcon).attrs(() => ({
  icon: faEdit
})
)`
`;

const TrashIcon = styled(BaseIcon).attrs(() => ({
  icon: faTrash
})
)`
  margin-left: 4px;
  width: 16px;
`;

export interface InvestmentyEntryProps {
  investment : Investment;
}

export const InvestmentEntry = React.memo((props : InvestmentyEntryProps) => {
  const {
    investment
  } = props;

  const { t } = useTranslation();
  const { setInvestmentToBeUpdated } = useContext(UpdateInvestmentContext);
  const { setInvestmentToBeDeleted } = useContext(DeleteInvestmentContext);
  const { formatCurrency } = useLocalization();
  
  const displayableInvestmentType = InvestmentsService.displayableInvestmentType(investment.type);
  const formattedValue = formatCurrency(investment.value);

  return (
    <Container>
      <LeftColumn>
        <EditIcon onClick={() => setInvestmentToBeUpdated(investment)}/>
        <TrashIcon onClick={() => setInvestmentToBeDeleted(investment)}/>
        <InvestmentTypeField>{t(displayableInvestmentType)}</InvestmentTypeField>
      </LeftColumn>
      
      <RightColumn>
        <InvestmentIdentifierField>{investment.identifier}</InvestmentIdentifierField>

        <InvestmentValueField>{formattedValue}</InvestmentValueField>
      </RightColumn>
    </Container>
  );
});

InvestmentEntry.displayName = "InvestmentEntry";