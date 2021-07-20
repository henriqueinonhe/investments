import { asyncCallback, useIsMounted } from "@henriqueinonhe/react-hooks";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../components/Button";
import { DeleteInvestmentModal } from "../components/DeleteInvestmentModal";
import { FormModal } from "../components/FormModal";
import { InvestmentForm } from "../components/InvestmentForm";
import { InvestmentsDisplay } from "../components/InvestmentsDisplay";
import { InvestmentsSummaryChart } from "../components/InvestmentsSummaryChart";
import { LoadingComponentWrapper } from "../components/LoadingComponentWrapper";
import { PageLayout } from "../components/PageLayout";
import { DeleteInvestmentContext } from "../contexts/DeleteInvestmentContext";
import { UpdateInvestmentContext } from "../contexts/UpdateInvestmentContext";
import { CreateInvestmentData, GetInvestmentsQuery, Investment, InvestmentsService, InvestmentsSummary, UpdateInvestmentData } from "../services/InvestmentsService";
import { Notification } from "../components/Notification";
import { useNotification } from "../hooks/useNotification";


const AddInvestmentButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
`;

const AddInvestmentButton = styled(Button)`
  padding: 10px;
  width: 100%;

  @media(min-width: 426px) {
    width: 200px;
  }
`;

const InvestmentsDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const LanguageSelectContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 5px;
`;

const LanguageSelectLabel = styled.label``;

const LanguageSelect = styled.select`
  margin-left: 12px;
`;

const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
`;

const InvestmentsSummaryChartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 20px;
  max-width: 480px;
`;

const InvestmentsDisplayOuterContainer = styled.div`
`;

export function InvestmentsWallet() : JSX.Element {
  const { t, i18n } = useTranslation();
  const [investments, setInvestments] = useState<Array<Investment>>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [investmentsAreLoading, setInvestmentsAreLoading] = useState(true);
  const [investmentsSummary, setInvestmentsSummary] = useState<InvestmentsSummary>([]);
  const [investmentsSummaryIsLoading, setInvestmentsSummaryIsLoading] = useState(true);
  const isMounted = useIsMounted();

  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [investmentToBeUpdated, setInvestmentToBeUpdated] = useState<Investment | undefined>();
  const [investmentToBeDeleted, setInvestmentToBeDeleted] = useState<Investment | undefined>();

  const showNotification = useNotification();

  useEffect(() => {
    getInvestments();
    getInvestmentsSummary();
  }, []);

  function getInvestmentsSummary() : void {
    asyncCallback(isMounted, async () => {
      return await InvestmentsService.getInvestmentsSummary();
    }, (fetchedInvesmentsSummary) => {
      setInvestmentsSummary(fetchedInvesmentsSummary);
    }, setInvestmentsSummaryIsLoading);
  }

  function getMoreResults() : void {
    const nextPage = page + 1;
    const query = {
      page: nextPage
    };

    getInvestments(query);
    setPage(nextPage);
  }
  
  function getInvestments(query ?: GetInvestmentsQuery) : void {
    asyncCallback(isMounted, async () => {
      return await InvestmentsService.getInvestments(query);
    }, (data) => {
      setInvestments(investments => [...investments, ...data.data]);
      setLastPage(data.meta.lastPage);
    }, setInvestmentsAreLoading);
  }

  function addInvestment(investment : CreateInvestmentData) : void {
    asyncCallback(isMounted, async () => {
      return await InvestmentsService.createInvestment(investment);
    }, (createdInvestment) => {

      setInvestments(investments => [...investments, createdInvestment]);
      getInvestmentsSummary();
      setShowAddInvestmentModal(false);
      showNotification({
        variant: "success",
        text: t("Invesment added successfully!")
      });
    });
  }

  function updateInvestment(newInvestment : UpdateInvestmentData) : void {
    asyncCallback(isMounted, async () => {
      return await InvestmentsService.updateInvestment(investmentToBeUpdated!.id, newInvestment);
    }, (updatedInvestment) => {
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

      getInvestmentsSummary();
      setInvestmentToBeUpdated(undefined);
      showNotification({
        variant: "success",
        text: t("Invesment updated successfully!")
      });
    });
  }

  function deleteInvestment() : void {
    asyncCallback(isMounted, async () => {
      return await InvestmentsService.deleteInvestment(investmentToBeDeleted!.id);
    }, (deletedInvestment) => {
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

      getInvestmentsSummary();
      setInvestmentToBeDeleted(undefined);
      showNotification({
        variant: "success",
        text: t("Invesment deleted successfully!")
      });
    });
  }

  return (
    <PageLayout>
      <LanguageSelectContainer>
        <LanguageSelectLabel>{t("Language")}</LanguageSelectLabel>

        <LanguageSelect
          value={i18n.language}
          onChange={event => i18n.changeLanguage(event.target.value)}
        >
          <option value="pt">PT</option>
          <option value="en">EN</option>
        </LanguageSelect>
      </LanguageSelectContainer>

      <Title>{t("Investments Wallet")}</Title>

      <InvestmentsDisplayOuterContainer>
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
                isLoading={investmentsAreLoading}
                setIsLoading={setInvestmentsAreLoading}
                getMoreResults={getMoreResults}
                hasMoreResults={page !== lastPage}
              />
            </InvestmentsDisplayContainer>

          </DeleteInvestmentContext.Provider>
        </UpdateInvestmentContext.Provider>
      </InvestmentsDisplayOuterContainer>

      <InvestmentsSummaryChartContainer>
        <LoadingComponentWrapper isLoading={investmentsSummaryIsLoading}>
          <InvestmentsSummaryChart 
            summary={investmentsSummary}
          />
        </LoadingComponentWrapper>
      </InvestmentsSummaryChartContainer>

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
              onCancel={() => { setInvestmentToBeUpdated(undefined); }}
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
    </PageLayout>
  );
}

