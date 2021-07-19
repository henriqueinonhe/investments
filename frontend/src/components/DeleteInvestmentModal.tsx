import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Investment, InvestmentsService } from "../services/InvestmentsService";
import { Button } from "./Button";
import { Modal } from "./Modal";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  /* height: 100%; */
  background-color: white;
  padding: 20px;
  max-width: 600px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
`;

const InvestmentDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const InvestmentDataField = styled.div`
  margin-top: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const YesButton = styled(Button)`
  width: 70px;
  margin-left: 20px;
`;

const NoButton = styled(Button)`
  width: 70px;
`;

export interface DeleteInvestmentModalProps {
  investment : Investment;
  onYes : () => void;
  onNo : () => void;
}

export function DeleteInvestmentModal(props : DeleteInvestmentModalProps) : JSX.Element {
  const {
    investment,
    onYes,
    onNo
  } = props;

  const { t } = useTranslation();

  const {
    identifier,
    type,
    value,
    date
  } = investment;

  return (
    <Modal>
      <Container>
        <Content>
          <Title>{t("Delete this investment?")}</Title>

          <InvestmentDataContainer>
            <InvestmentDataField>{t("Date")}: {date}</InvestmentDataField>
            <InvestmentDataField>{t("Type")}: {t(InvestmentsService.displayableInvestmentType(type))}</InvestmentDataField>
            <InvestmentDataField>{t("Identifier")}: {identifier}</InvestmentDataField>
            <InvestmentDataField>{t("Amount")}: R$ {value}</InvestmentDataField>
          </InvestmentDataContainer>

          <ButtonRow>
            <NoButton
              variant="secondary"
              onClick={onNo}
            >
              {t("No")}
            </NoButton>

            <YesButton
              onClick={onYes}
            >
              {t("Yes")}
            </YesButton>
          </ButtonRow>
        </Content>
      </Container>
    </Modal>
  );
}