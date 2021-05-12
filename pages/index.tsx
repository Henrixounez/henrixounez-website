import { useState }               from 'react';
import styled                     from 'styled-components'
import Link                       from 'next/link';
import { bpdw, BreakpointSizes }  from '../components/breakpoints';
import Page                       from '../components/Page';
import { GradientTitle } from '../components/GradientTitle';

const HeroContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
`;

const CustomGradientTitle = styled(GradientTitle)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  transition: 500ms;
  cursor: pointer;
  &:hover {
    font-size: 5.5rem;
    ${bpdw(BreakpointSizes.md)} {
      font-size: 3rem;
    }  
  }
`;

export default function Index() {
  const [ shadow, setShadow ] = useState(false);

  return (
    <Page shadowBg={shadow}>
      <HeroContainer>
        <Link href='/about'>
          <CustomGradientTitle id='gradient'
            onMouseEnter={() => {
              setShadow(true);
            }}
            onMouseLeave={() => {
              setShadow(false);
            }}
          >
            Henrixounez
          </CustomGradientTitle>
        </Link>
      </HeroContainer>
    </Page>
  );
}
