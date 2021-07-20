/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth0 } from "@auth0/auth0-react";
import { features } from "../helpers/featureFlags";

export function useMyAuth0() : ReturnType<typeof useAuth0> {
  const isMocked = !features.Auth0;
  const source = useAuth0();

  return {
    ...source,
    isAuthenticated: isMocked ? true : source.isAuthenticated,
    isLoading: isMocked ? false : source.isLoading,
    getAccessTokenSilently: isMocked ? () => "DummyToken" as any : source.getAccessTokenSilently,
    loginWithRedirect: isMocked ? (() => { /* */ }) as any : source.loginWithRedirect,
    logout: isMocked ? (() => { alert("Mocked logout"); }) as any : source.logout,
    user: isMocked ? {
      picture: "https://www.drshaneholmes.com/wp-content/uploads/2020/03/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      name: "Test User",
      email: "email@example.com"
    } : source.user
  };
}