import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Investment, InvestmentsService } from "../services/InvestmentsServices";
import { groupBy } from "lodash";
import { InvestmentGroup } from "./InvestmentGroup";
import { useIsMounted, useAsync } from "@henriqueinonhe/react-hooks";
import { LoadingComponentWrapper } from "./LoadingComponentWrapper";
import { Spinner } from "./Spinner";

const Container = styled.ul`
  overflow-y: scroll;
  margin-top: 20px;
  padding: 0 10px;
  height: 50vh;
`;

const ListEndMarker = styled.li`
  height: 60px;
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
  const [investments, setInvestments] = useState<Array<Investment>>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [moreResultsAreLoading, setMoreResultsAreLoading] = useState(false);
  const isMounted = useIsMounted();
  const listEndMarkerRef = useRef<HTMLLIElement>(null);

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

  const investmentGroups = groupInvestmentsByDate(investments);

  return (
    <Container>
      <LoadingComponentWrapper isLoading={isLoading}>
        {
          investmentGroups.map(group => 
            <InvestmentGroup 
              key={group.date}
              investmentGroup={group}
            />)
        }
      </LoadingComponentWrapper>

      {
        moreResultsAreLoading &&
        <Spinner /> 
      }
      <ListEndMarker ref={listEndMarkerRef}/>
    </Container>
  ) ;
}