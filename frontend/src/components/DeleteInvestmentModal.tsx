import { asyncCallback, useIsMounted } from "@henriqueinonhe/react-hooks";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useLocalization } from "../hooks/useLocalization";
import { Investment, InvestmentsService } from "../services/InvestmentsService";
import { Button } from "./Button";
import { CenteredSpinner } from "./CenteredSpinner";
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
  onYes : () => Promise<void>;
  onNo : () => Promise<void>;
}

export function DeleteInvestmentModal(props : DeleteInvestmentModalProps) : JSX.Element {
  const {
    investment,
    onYes,
    onNo
  } = props;

  const { t } = useTranslation();
  const [saveIsLoading, setSaveIsLoading] = useState(false);
  const { formatDate, formatCurrency } = useLocalization();
  const isMounted = useIsMounted();

  const {
    identifier,
    type,
    value,
    date
  } = investment;

  function handleYes() : void {
    asyncCallback(isMounted, async () => {
      await onYes();
    }, () => {
      //
    }, setSaveIsLoading);
  }

  function handleNo() : void {
    asyncCallback(isMounted, async () => {
      await onNo();
    }, () => {
      //
    }, setSaveIsLoading);
  }

  return (
    <Modal>
      <Container>
        <Content>
          <Title>{t("Delete this investment?")}</Title>

          <InvestmentDataContainer>
            <InvestmentDataField>{t("Date")}: {formatDate(date)}</InvestmentDataField>
            <InvestmentDataField>{t("Type")}: {t(InvestmentsService.displayableInvestmentType(type))}</InvestmentDataField>
            <InvestmentDataField>{t("Identifier")}: {identifier}</InvestmentDataField>
            <InvestmentDataField>{t("Amount")}: {formatCurrency(value)}</InvestmentDataField>
          </InvestmentDataContainer>

          <ButtonRow>
            <NoButton
              variant="secondary"
              onClick={handleNo}
            >
              {t("No")}
            </NoButton>

            <YesButton
              onClick={handleYes}
            >
              {t("Yes")}
            </YesButton>
          </ButtonRow>
        </Content>
      </Container>

      {
        saveIsLoading &&
        <Modal>
          <CenteredSpinner />
        </Modal>
      }
    </Modal>
  );
}