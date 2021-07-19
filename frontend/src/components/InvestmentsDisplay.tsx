import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Investment } from "../services/InvestmentsService";
import { groupBy } from "lodash";
import { InvestmentGroup } from "./InvestmentGroup";
import { Spinner } from "./Spinner";
import { useTranslation } from "react-i18next";

const Container = styled.ul`
  overflow-y: scroll;
  padding: 0 10px;
  height: 50vh;
  border: 2px dashed ${props => props.theme.primaryColor};
`;

const ListEndMarker = styled.li`
  height: 60px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const NoResults = styled.li`
  text-align: center;
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

export interface InvestmentsDisplayProps {
  investments : Array<Investment>;
  isLoading : boolean;
  setIsLoading :  React.Dispatch<React.SetStateAction<boolean>>;
  getMoreResults : () => void;
  hasMoreResults : boolean;
}

export function InvestmentsDisplay(props : InvestmentsDisplayProps) : JSX.Element {
  const {
    investments,
    isLoading,
    setIsLoading,
    getMoreResults,
    hasMoreResults
  } = props;

  const listEndMarkerRef = useRef<HTMLLIElement>(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && 
         !isLoading &&
         hasMoreResults) {
        getMoreResults();
      }
    }, {
      root: null,
      threshold: 0.8
    });
  
    observer.observe(listEndMarkerRef.current!);
  
    return () => {
      observer.disconnect();
    };
  }, [isLoading, setIsLoading, getMoreResults, hasMoreResults]);

  const investmentGroups = groupInvestmentsByDate(investments);

  return (
    <Container>
      {
        investmentGroups.map(group => 
          <InvestmentGroup 
            key={group.date}
            investmentGroup={group}
          />)
      }

      {
        investments.length === 0 && 
        !isLoading &&
        <NoResults>
          {t("There are no investments")}
        </NoResults>
      }

      {
        isLoading &&
        <SpinnerContainer>
          <Spinner /> 
        </SpinnerContainer>
      }
      <ListEndMarker ref={listEndMarkerRef}/>
    </Container>
  ) ;
}