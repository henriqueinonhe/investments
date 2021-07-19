import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "./Button";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftColumn = styled.div`
  display: flex;
  align-items: center;
`;

const RightColumn = styled.div``;

const Photo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const Name = styled.div`
  font-size: 12px;
`;

const Email = styled.div`
  font-size: 12px;
  margin-top: 4px;
`;

const LogoutButton = styled(Button)`
  margin-left: 8px;
`;

export const Profile = React.memo(() => {
  const { user, logout } = useAuth0();
  const { t } = useTranslation();

  return (
    <Container>
      <LeftColumn>
        <Photo src={user?.picture}/>

        <Info>
          <Name>{user?.name}</Name>
          <Email>{user?.email}</Email>
        </Info>
      </LeftColumn>

      <RightColumn>
        <LogoutButton
          onClick={() => logout()}
        >
          {t("Logout")}
        </LogoutButton>
      </RightColumn>
    </Container>
  );
});

Profile.displayName = "Profile";