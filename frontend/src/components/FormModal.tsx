import React from "react";
import styled from "styled-components";
import { Modal } from "./Modal";

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 32px;
  text-align: center;
`;

const ModalContent = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  background-color: white;
`;

export interface FormModalProps {
  title : string;
  children : React.ReactNode;
}

export function FormModal(props : FormModalProps) : JSX.Element {
  const {
    title,
    children
  } = props;


  return (
    <Modal>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        {children}
      </ModalContent>
    </Modal>
  );
}