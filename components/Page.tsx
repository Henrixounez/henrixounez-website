import { FunctionComponent } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import TopBar from './TopBar';

const Container = styled.div<{noShowBg?: boolean, overrideBg?: string, shadowBg?: boolean}>`
  position: relative;
  min-height: 100vh;
  background: rgb(10, 10, 10);
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: calc(100vw - 1px);
    transition: .5s;
    ${({noShowBg, overrideBg, shadowBg}) => noShowBg ? `
      background-color: rgb(10, 10, 10);
    ` : `
      background-image: url(${overrideBg ? overrideBg : '/screen.png'});
      background-size: cover;
      filter: ${!shadowBg ?
        `brightness(0.3) grayscale(0.8)` :
        `brightness(0.2) grayscale(0.8)`
      };
    `}
  }
  #content {
    position: absolute;
  }
`;

const Content = styled.div`
  position: relative;
  left: 0;
  z-index: 2;
  padding: 80px 0;
  top: 0;
  left: 0;
  right: 0;
  color: white;
`;

interface PageProps {
  noShowBg?: boolean,
  overrideBg?: string,
  shadowBg?: boolean,
}
const Page: FunctionComponent<PageProps> = ({children, noShowBg, overrideBg, shadowBg}) => (
  <Container noShowBg={noShowBg || false} overrideBg={overrideBg} shadowBg={shadowBg} id="PageContainer">
    <Head>
      <title>Henrixounez</title>
    </Head>
    <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
        }
      `}</style>
    <Content id='content'>
      {children}
    </Content>
    <TopBar/>
  </Container>
);

export default Page;