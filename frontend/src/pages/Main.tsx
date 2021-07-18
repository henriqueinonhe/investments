import { asyncCallback, useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";
import { DeleteInvestmentModal } from "../components/DeleteInvestmentModal";
import { FormModal } from "../components/FormModal";
import { Header } from "../components/Header";
import { InvestmentForm } from "../components/InvestmentForm";
import { InvestmentsDisplay } from "../components/InvestmentsDisplay";
import { DeleteInvestmentContext } from "../contexts/DeleteInvestmentContext";
import { UpdateInvestmentContext } from "../contexts/UpdateInvestmentContext";
import { CreateInvestmentData, GetInvestmentsQuery, Investment, InvestmentsService, UpdateInvestmentData } from "../services/InvestmentsService";

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
  const [investments, setInvestments] = useState<Array<Investment>>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [investmentToBeUpdated, setInvestmentToBeUpdated] = useState<Investment | undefined>();
  const [investmentToBeDeleted, setInvestmentToBeDeleted] = useState<Investment | undefined>();

  useAsync(isMounted, async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await InvestmentsService.getInvestments();
  }, (data) => {
    setInvestments(data.data);
    setLastPage(data.meta.lastPage);
  }, [], setIsLoading);

  function getInvestments(query ?: GetInvestmentsQuery) : void {
    asyncCallback(isMounted, async () => {
      return await InvestmentsService.getInvestments(query);
    }, (data) => {
      setInvestments(data.data);
      setLastPage(data.meta.lastPage);
    }, setIsLoading);
  }

  function addInvestment(investment : CreateInvestmentData) : void {
    asyncCallback(isMounted, async () => {
      try {
        return await InvestmentsService.createInvestment(investment);
      }
      catch(error) {
        console.log(error);
      }
    }, () => {
      getInvestments();
      setShowAddInvestmentModal(false);
    });
  }

  function updateInvestment(newInvestment : UpdateInvestmentData) : void {
    asyncCallback(isMounted, async () => {
      try {
        return await InvestmentsService.updateInvestment(investmentToBeUpdated!.id, newInvestment);
      }
      catch(error) {
        console.log(error.response.data);
      }
    }, (updatedInvestment) => {
      if(updatedInvestment) {
        //This could be O(1) if the id is passed 
        //altoghether the investment to the InvestmentEntry 
        //component
        setInvestments(investments => {
          const newInvestments = investments.slice();
          const updatedInvestmentIndex = newInvestments
            .findIndex(entry => entry.id === updatedInvestment.id);
          newInvestments[updatedInvestmentIndex] = updatedInvestment;

          return newInvestments;
        });
      }
      setInvestmentToBeUpdated(undefined);
    });
  }

  function deleteInvestment() : void {
    asyncCallback(isMounted, async () => {
      try {
        return await InvestmentsService.deleteInvestment(investmentToBeDeleted!.id);
      }
      catch(error) {
        console.log(error.response.data);
      }
    }, (deletedInvestment) => {
      if(deletedInvestment) {
        //This could be O(1) if the id is passed 
        //altoghether the investment to the InvestmentEntry 
        //component
        setInvestments(investments => {
          const newInvestments = investments.slice();
          const deletedInvestmentIndex = newInvestments
            .findIndex(entry => entry.id === deletedInvestment.id);
          newInvestments.splice(deletedInvestmentIndex, 1);

          return newInvestments;
        });
      }
      setInvestmentToBeDeleted(undefined);
    });
  }

  return (
    <Container>
      <Header />

      <AddInvestmentButtonRow>
        <AddInvestmentButton
          onClick={() => setShowAddInvestmentModal(true)}
        >
          {t("Add Investment")}
        </AddInvestmentButton>
      </AddInvestmentButtonRow>
      
      <UpdateInvestmentContext.Provider value={{
        investmentToBeUpdated,
        setInvestmentToBeUpdated
      }}>
        <DeleteInvestmentContext.Provider value={{
          investmentToBeDeleted,
          setInvestmentToBeDeleted
        }}>
          <InvestmentsDisplayContainer>
            <InvestmentsDisplay 
              investments={investments}
              isLoading={isLoading}
            />
          </InvestmentsDisplayContainer>

        </DeleteInvestmentContext.Provider>
      </UpdateInvestmentContext.Provider>


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

      {
        investmentToBeUpdated &&
        <FormModal
          title={t("Edit Investment")}
        >
          <InvestmentForm 
            onCancel={() => { setInvestmentToBeUpdated(undefined);}}
            onSave={investment => updateInvestment(investment)}
            investment={investmentToBeUpdated}
          />
        </FormModal>
      }

      {
        investmentToBeDeleted &&
        <DeleteInvestmentModal 
          investment={investmentToBeDeleted}
          onNo={() => setInvestmentToBeDeleted(undefined)}
          onYes={deleteInvestment}
        />
      }
    </Container>
  );
}