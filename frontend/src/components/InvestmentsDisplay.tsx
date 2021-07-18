import React, { useRef } from "react";
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

export interface InvestmentsDisplayProps {
  investments : Array<Investment>;
  isLoading : boolean;
}

export function InvestmentsDisplay(props : InvestmentsDisplayProps) : JSX.Element {
  const {
    investments,
    isLoading
  } = props;

  const { t } = useTranslation();
  const listEndMarkerRef = useRef<HTMLLIElement>(null);
  
  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     if(entries[0].isIntersecting && !moreResultsAreLoading) {
  //       setMoreResultsAreLoading(true);
  //       setTimeout(() => setMoreResultsAreLoading(false), 1000);
  //     }
  //   }, {
  //     root: null,
  //     threshold: 0.8
  //   });
  
  //   observer.observe(listEndMarkerRef.current!);
  
  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [moreResultsAreLoading]);

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
        isLoading &&
        <SpinnerContainer>
          <Spinner /> 
        </SpinnerContainer>
      }
      <ListEndMarker ref={listEndMarkerRef}/>
    </Container>
  ) ;
}