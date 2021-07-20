import React, { Suspense, useEffect, useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { InvestmentsWallet } from "./pages/InvestmentsWallet";
import { lightTheme } from "./helpers/theme";
import { Login } from "./pages/Login";
import { asyncCallback, useIsMounted } from "@henriqueinonhe/react-hooks";
import { BaseAPIService } from "./services/BaseAPIService";
import { LoadingComponentWrapper } from "./components/LoadingComponentWrapper";
import "../assets/fontCss.css";
import { NotificationProps, Notification } from "./components/Notification";
import { NotificationContext } from "./contexts/NotificationContext";
import { useMyAuth0 } from "./hooks/useMyAuth0";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

  /* http://meyerweb.com/eric/tools/css/reset/ 
    v2.0 | 20110126
    License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Raleway', sans-serif;
    color: #222;
    letter-spacing: 0.4px;
  }

  html, body, #root {
    height: 100%;
  }
`;

const ModalContainer = styled.div``;

export function App() : JSX.Element {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useMyAuth0();
  const [notificationProps, setNotificationProps] = useState<NotificationProps | undefined>();
  const [apiServiceIsAuthenticated, setApiServiceIsAuthenticated] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if(isAuthenticated) {
      asyncCallback(isMounted, async () => {
        return await getAccessTokenSilently({
          audience: process.env.AUTH0_AUDIENCE!
        });
      }, (token) => {
        BaseAPIService.initialize(token);
        setApiServiceIsAuthenticated(true);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <Suspense fallback={<></>}>
      <GlobalStyle />
      <ThemeProvider theme={lightTheme}>
        <NotificationContext.Provider value={{setNotificationProps}}>
          <LoadingComponentWrapper isLoading={isLoading}>
            {
              isAuthenticated ?
                <LoadingComponentWrapper isLoading={!apiServiceIsAuthenticated}>
                  <InvestmentsWallet /> 
                </LoadingComponentWrapper> :
                <Login />
            }
          </LoadingComponentWrapper>
        </NotificationContext.Provider>

        <ModalContainer id="modalContainer"/>
        
        {
          notificationProps &&
          <Notification {...notificationProps}/>
        }
      </ThemeProvider>
    </Suspense>
  );
}
