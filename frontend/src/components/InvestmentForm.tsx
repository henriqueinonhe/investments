import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { CreateInvestmentData, InvestmentType } from "../services/InvestmentsService";
import { Button } from "./Button";
import Dayjs from "../helpers/dayjs";
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

const InputErrorDisplay = styled.div`
  color: #ff7c70;
  font-size: 14px;
  margin-top: 8px;
`;

const TextInput = styled.input`
  height: 30px;
  font-size: 16px;
`;

const DropdownInput = styled.select`
  height: 30px;
  font-size: 16px;
`;

const DateInput = styled.input.attrs(() => ({
  type: "date"
})
// eslint-disable-next-line function-paren-newline
)`
  height: 30px;
  font-size: 16px;
`;

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

export type InvestmentValidationErrorCode = "EmptyIdentifier" | 
                                            "NonPositiveValue" |
                                            "ValueIsNotANumber";

function validateCreateInvestmentData(investment : CreateInvestmentData) : Array<InvestmentValidationErrorCode> {
  const errors : Array<InvestmentValidationErrorCode> = [];

  if(investment.identifier === "") {
    errors.push("EmptyIdentifier");
  } 

  if(investment.value <= 0) {
    errors.push("NonPositiveValue");
  }

  if(isNaN(investment.value)) {
    errors.push("ValueIsNotANumber");
  }

  return errors;
}

type ValidationErrorMessageMap = {
  [key in InvestmentValidationErrorCode] : string;
};


export interface InvestmentFormProps {
  investment ?: CreateInvestmentData;
  onCancel : () => Promise<void>;
  onSave : (investment : CreateInvestmentData) => Promise<void>;
}

export function InvestmentForm(props : InvestmentFormProps) : JSX.Element {
  const {
    investment,
    onCancel,
    onSave
  } = props;
  
  const initialIdentifier = investment?.identifier ?? "";
  const initialType = investment?.type ?? "FIXED";
  const initialValue = investment?.value?.toFixed(2).toString() ?? "";
  const initialDate = investment?.date ? 
    Dayjs.utc(investment.date).format("YYYY-MM-DD") : 
    Dayjs().format("YYYY-MM-DD");

  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [type, setType] = useState<InvestmentType | undefined>(initialType);
  const [value, setValue] = useState(initialValue);
  const [date, setDate] = useState(initialDate);
  const [validationErrors, setValidationErrors] = useState<Array<InvestmentValidationErrorCode>>([]);
  const [saveIsLoading, setSaveIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const { t } = useTranslation();

  const validationErrorMessageMap : ValidationErrorMessageMap = {
    EmptyIdentifier: t("Identifier cannot be empty!"),
    NonPositiveValue: t("Amount must be a positive number!"),
    ValueIsNotANumber: t("Amount must be a number!")
  };

  function computeErrorMessage(validationErrors : Array<InvestmentValidationErrorCode>, 
                               codes : Array<InvestmentValidationErrorCode>) : string | null {
    for(const code of codes) {
      if(validationErrors.includes(code)) {
        return validationErrorMessageMap[code];
      }
    }

    return null;
  }

  function handleSaveButtonClicked() : void {
    const investment : CreateInvestmentData = {
      identifier: identifier.trim(),
      type: type as InvestmentType,
      value: parseFloat(value.replace(/,/g, ".")),
      date
    };

    const validationErrors = validateCreateInvestmentData(investment);
    setValidationErrors(validationErrors);

    if(validationErrors.length !== 0) {
      return;
    }

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
        <InputErrorDisplay>
          {computeErrorMessage(validationErrors, ["EmptyIdentifier"])}
        </InputErrorDisplay>
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("Type")}</InputLabel>
        <DropdownInput
          value={type}
          onChange={event => setType(event.target.value as InvestmentType | undefined)}
        >
          <option value="FIXED">{t("Fixed Income")}</option>
          <option value="VARIABLE">{t("Variable Income")}</option>
        </DropdownInput>
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("Amount")} (R$)</InputLabel>
        <TextInput 
          value={value}
          onChange={event => setValue(event.target.value)}
        />
        <InputErrorDisplay>
          {computeErrorMessage(validationErrors, ["NonPositiveValue", "ValueIsNotANumber"])}
        </InputErrorDisplay>
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