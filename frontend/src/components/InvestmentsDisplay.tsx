import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Investment } from "../services/InvestmentsServices";
import RandExp from "randexp";
import { sample, random, groupBy } from "lodash";
import { InvestmentGroup } from "./InvestmentGroup";

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

  useEffect(() => {
    //MOCK
    setInvestments(new Array(20).fill(null).map(() => ({
      id: new RandExp(/\w{32}/).gen(),
      identifier: new RandExp(/\w{4,20}/).gen(),
      type: sample(["FIXED", "VARIABLE"])!,
      value: random(5000, 100, true),
      date: new RandExp(/2021-01-0[1-9]/).gen()
    })));
  }, []);

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