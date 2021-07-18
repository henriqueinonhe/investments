/* eslint-disable function-paren-newline */
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Investment, InvestmentsService } from "../services/InvestmentsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UpdateInvestmentContext } from "../contexts/UpdateInvestmentContext";
import { DeleteInvestmentContext } from "../contexts/DeleteInvestmentContext";

const Container = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 12px;
`;

const InvestmentBaseField = styled.div``;

const InvestmentTypeField = styled(InvestmentBaseField)`
  margin-left: 4px;
`;

const InvestmentIdentifierField = styled(InvestmentBaseField)`
  margin-left: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const InvestmentValueField = styled(InvestmentBaseField)`
  margin-left: 12px;
  white-space: nowrap;
`;

const IconAndInvestmentTypeContainer = styled.div`
  display: flex;
`;

const EditIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faEdit
})
)`
`;

const TrashIcon = styled(FontAwesomeIcon).attrs(() => ({
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

  const displayableInvestmentType = InvestmentsService.displayableInvestmentType(investment.type);

  return (
    <Container>
      <IconAndInvestmentTypeContainer>
        <EditIcon onClick={() => setInvestmentToBeUpdated(investment)}/>
        <TrashIcon onClick={() => setInvestmentToBeDeleted(investment)}/>
        <InvestmentTypeField>{t(displayableInvestmentType)}</InvestmentTypeField>
      </IconAndInvestmentTypeContainer>
      
      <InvestmentIdentifierField>{investment.identifier}</InvestmentIdentifierField>

      {/* FORMAT CURRENCY! */}
      <InvestmentValueField>{`R$ ${investment.value.toFixed(2).toString()}`}</InvestmentValueField>
    </Container>
  );
});

InvestmentEntry.displayName = "InvestmentEntry";