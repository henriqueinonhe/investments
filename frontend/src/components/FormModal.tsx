import React from "react";
import styled from "styled-components";
import { Modal } from "./Modal";

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 32px;
  text-align: center;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ModalContent = styled.div`
  padding: 20px;
  width: 100%;
  /* height: 100%; */
  max-width: 600px;
  /* max-height: 400px; */
  background-color: white;
  border-radius: 4px;
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
      <ModalContentWrapper>
        <ModalContent>
          <ModalTitle>{title}</ModalTitle>
          {children}
        </ModalContent>
      </ModalContentWrapper>
    </Modal>
  );
}