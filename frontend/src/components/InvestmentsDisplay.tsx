import React, { useState } from "react";
import styled from "styled-components";
import { Investment, InvestmentsService } from "../services/InvestmentsServices";
import { groupBy } from "lodash";
import { InvestmentGroup } from "./InvestmentGroup";
import { useIsMounted, useAsync } from "@henriqueinonhe/react-hooks";

const Container = styled.ul`
  overflow-y: scroll;
  margin-top: 20px;
  padding: 0 10px;
  max-height: 50vh;
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
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  useAsync(isMounted, async () => {
    return await InvestmentsService.getInvestments({page: 2});
  }, (data) => {
    setInvestments(data.data);
  }, [], setIsLoading);

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
    </Container>
  ) ;
}