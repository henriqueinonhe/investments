import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { CreateInvestmentData, InvestmentType } from "../services/InvestmentsServices";
import { Button } from "./Button";
import Dayjs from "../helpers/dayjs";
import { LoadingComponentWrapper } from "./LoadingComponentWrapper";
import { Modal } from "./Modal";
import { asyncCallback, useIsMounted } from "@henriqueinonhe/react-hooks";
import { CenteredSpinner } from "./CenteredSpinner";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const InputLabel = styled.label`
  margin-bottom: 4px;
`;

const TextInput = styled.input`

`;

const DropdownInput = styled.select`

`;

//TODO Use material date picker
const DateInput = styled.input.attrs(() => ({
  type: "date"
})
// eslint-disable-next-line function-paren-newline
)``;

const ButtonRow = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(Button)`

`;

const SaveButton = styled(Button)`
  margin-left: 20px;
`;

export interface InvestmentFormProps {
  onCancel : () => void;
  onSave : (investment : CreateInvestmentData) => void;
}

export function InvestmentForm(props : InvestmentFormProps) : JSX.Element {
  const {
    onCancel,
    onSave
  } = props;

  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState<InvestmentType | undefined>();
  const [value, setValue] = useState("");
  const [date, setDate] = useState(Dayjs().format("YYYY-MM-DD"));
  const [saveIsLoading, setSaveIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const { t } = useTranslation();

  function handleSaveButtonClicked() : void {
    //TODO Validate
    const investment : CreateInvestmentData = {
      identifier,
      type: type as InvestmentType,
      value: parseFloat(value),
      date
    };

    asyncCallback(isMounted, async () => {
      await onSave(investment);
    }, () => {
      //
    }, setSaveIsLoading);
  }

  return (
    <Container>
      <InputContainer>
        <InputLabel>{t("Identifier")}</InputLabel>
        <TextInput 
          value={identifier}
          onChange={event => setIdentifier(event.target.value)}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("Type")}</InputLabel>
        <DropdownInput
          value={type}
          onChange={event => setType(event.target.value as InvestmentType | undefined)}
        >
          <option value={undefined}>-- Select --</option>
          <option value="FIXED">{t("Fixed")}</option>
          <option value="VARIABLE">{t("Variable")}</option>
        </DropdownInput>
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("Amount")}</InputLabel>
        <TextInput 
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </InputContainer>      

      <InputContainer>
        <InputLabel>{t("Date")}</InputLabel>
        <DateInput 
          value={date}
          onChange={event => setDate(event.target.value)}
        />
      </InputContainer>

      <ButtonRow>
        <CancelButton 
          variant="secondary"
          onClick={onCancel}
        >
          {t("Cancel")}
        </CancelButton>

        <SaveButton
          onClick={handleSaveButtonClicked}
        >
          {t("Save")}
        </SaveButton>
      </ButtonRow>

      {
        saveIsLoading &&
        <Modal>
          <CenteredSpinner />
        </Modal>
      }
    </Container>
  );
}