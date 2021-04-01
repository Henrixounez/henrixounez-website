import { useEffect, useRef }                 from 'react';
import styled                     from 'styled-components'
import Link                       from 'next/link';
import { bpdw, BreakpointSizes }  from '../components/breakpoints';
import Page                       from '../components/Page';
import { GradientTitle } from '../components/GradientTitle';

const heroPictureDefaultFilter = 'brightness(0.5) grayscale(0.8)';
const heroPictureHoveredFilter = 'brightness(0.3) grayscale(0.8)';

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
  const imgRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const img = document.getElementById('bghero');
    if (img) {
      imgRef.current = img;
      img.style.filter = heroPictureDefaultFilter;
    }
  }, []);

  return (
    <Page>
      <HeroContainer>
        <Link href='/about'>
          <CustomGradientTitle id='gradient'
            onMouseEnter={() => {
              if (imgRef && imgRef.current !== null)
                imgRef.current.style.filter = heroPictureHoveredFilter;
            }}
            onMouseLeave={() => {
              if (imgRef && imgRef.current !== null)
                imgRef.current.style.filter = heroPictureDefaultFilter;
            }}
          >
            Henrixounez
          </CustomGradientTitle>
        </Link>
      </HeroContainer>
    </Page>
  );
}
