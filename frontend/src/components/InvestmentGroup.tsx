import React from "react";
import styled from "styled-components";
import { Investment } from "../services/InvestmentsServices";
import { DateDivider } from "./DateDivider";
import { InvestmentEntry } from "./InvestmentEntry";

export interface InvestmentGroup {
  date : string;
  investments : Array<Investment>;
}

const Container = styled.li`
  margin-top: 32px;
`;

const List = styled.ul``;

export interface InvestmentGroupProps {
  investmentGroup : InvestmentGroup;
}

export const InvestmentGroup = React.memo((props : InvestmentGroupProps) => {
  const {
    investmentGroup
  } = props;

  return (
    <Container>
      {/* TODO FORMAT DATE */}
      <DateDivider>{investmentGroup.date}</DateDivider>
      <List>
        {
          investmentGroup.investments.map(investment =>
            <InvestmentEntry 
              key={investment.id}
              investment={investment}
            />)
        }
      </List>
    </Container>
  );
});

InvestmentGroup.displayName = "InvestmentGroup";