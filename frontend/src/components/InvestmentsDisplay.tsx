import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Investment, InvestmentsService, UpdateInvestmentData } from "../services/InvestmentsService";
import { groupBy } from "lodash";
import { InvestmentGroup } from "./InvestmentGroup";
import { useIsMounted, useAsync, asyncCallback } from "@henriqueinonhe/react-hooks";
import { LoadingComponentWrapper } from "./LoadingComponentWrapper";
import { Spinner } from "./Spinner";
import { UpdateInvestmentContext } from "../contexts/UpdateInvestmentContext";
import { FormModal } from "./FormModal";
import { InvestmentForm } from "./InvestmentForm";
import { useTranslation } from "react-i18next";
import { DeleteInvestmentContext } from "../contexts/DeleteInvestmentContext";
import { DeleteInvestmentModal } from "./DeleteInvestmentModal";

const Container = styled.ul`
  overflow-y: scroll;
  padding: 0 10px;
  height: 50vh;
`;

const ListEndMarker = styled.li`
  height: 60px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

function groupInvestmentsByDate(investments : Array<Investment>) : Array<InvestmentGroup> {
  const investmentGroups : Array<InvestmentGroup> = [];

  const temp = groupBy(investments, "date");
  for(const date in temp) {
    const groupedInvestments = temp[date];
    investmentGroups.push({
      date,
      investments: groupedInvestments
    });
  }
  
  return investmentGroups;
}

export function InvestmentsDisplay() : JSX.Element {
  const { t } = useTranslation();
  const [investments, setInvestments] = useState<Array<Investment>>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [moreResultsAreLoading, setMoreResultsAreLoading] = useState(false);
  const isMounted = useIsMounted();
  const listEndMarkerRef = useRef<HTMLLIElement>(null);

  //Update/Deleted Investment Related State
  const [investmentToBeUpdated, setInvestmentToBeUpdated] = useState<Investment | undefined>();
  const [investmentToBeDeleted, setInvestmentToBeDeleted] = useState<Investment | undefined>();

  useAsync(isMounted, async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await InvestmentsService.getInvestments();
  }, (data) => {
    setInvestments(data.data);
    setLastPage(data.meta.lastPage);
  }, [], setIsLoading);


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && !moreResultsAreLoading) {
        setMoreResultsAreLoading(true);
        setTimeout(() => setMoreResultsAreLoading(false), 1000);
      }
    }, {
      root: null,
      threshold: 0.8
    });
  
    observer.observe(listEndMarkerRef.current!);
  
    return () => {
      observer.disconnect();
    };
  }, [moreResultsAreLoading]);

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

  const investmentGroups = groupInvestmentsByDate(investments);

  return (
    <>
      <Container>
        <LoadingComponentWrapper isLoading={isLoading}>
          <UpdateInvestmentContext.Provider value={{
            investmentToBeUpdated,
            setInvestmentToBeUpdated
          }}>
            <DeleteInvestmentContext.Provider value={{
              investmentToBeDeleted,
              setInvestmentToBeDeleted
            }}>
              {
                investmentGroups.map(group => 
                  <InvestmentGroup 
                    key={group.date}
                    investmentGroup={group}
                  />)
              }
            </DeleteInvestmentContext.Provider>
          </UpdateInvestmentContext.Provider>
        </LoadingComponentWrapper>

        {
          moreResultsAreLoading &&
        <SpinnerContainer>
          <Spinner /> 
        </SpinnerContainer>
        }
        <ListEndMarker ref={listEndMarkerRef}/>
      </Container>

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
    </>
  ) ;
}