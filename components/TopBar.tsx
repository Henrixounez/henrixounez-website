import Link                       from 'next/link';
import { useEffect, useRef }      from 'react';
import styled                     from 'styled-components'
import { bpdw, BreakpointSizes }  from './breakpoints';

const TopBarBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5rem;
  z-index: 10;
  background: #0000;
  transition: 500ms;
`;

const TopBarContainer = styled.div`
  max-width: 1280px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  display: flex;
  padding: 1rem;
  height: 3rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MainSvg = styled.svg`
  width: 110px;
  height: 30px;
  cursor: pointer;
  &:hover {
    g {
      transition: 2000ms;
      stroke-dashoffset: 0;
    }
  }
`;

const MainG = styled.g`
  stroke: #FFFFFF;
  stroke-width: 1;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  transition: 2000ms;
  path {
    fill: url(#grad1);
    fill-opacity: 1;
  }
  &:hover {
    stroke-dashoffset: 0;
  }
  transform: scale(3) translate(-0.36500556px,-3.8330142px);
  ${bpdw(BreakpointSizes.md)} {
    transform: scale(2);
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;


const LinkText = styled.div`
  color: white;
  font-family: Inter;
  font-weight: 700;
  cursor: pointer;
  padding: 8px;
  transition: 500ms;

  background-repeat: no-repeat;
  background-image:
    linear-gradient(to right, #7928CA 0%, #bc14a5 100%),
    linear-gradient(to bottom, #bc14a5 0%, #FF0080 100%),
    linear-gradient(to bottom, #7928CA 0%, #bc14a5 100%),
    linear-gradient(to right, #bc14a5 0%, #FF0080 100%);
  background-position:
    0 0,
    100% 100%,
    0 0,
    100% 100%;
  background-size:
    0 1px,
    1px 0,
    1px 0,
    0 1px;

  &:hover {
    background-size:
    100% 1px,
    1px 100%,
    1px 100%,
    100% 1px;
  }
`;

const IconContainer = styled.div`
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Icon = styled.img`
  height: 1.75rem;
  width: 1.75rem;
  background: white;
  border-radius: 100%;
  padding: 1px;
  cursor: pointer;
  transition: 200ms;
  &:hover {
    padding: 2px;
    height: 2rem;
    width: 2rem;
  }
`;

const Links = () => (
  <LinksContainer>
    <Link href='/about'>
      <LinkText>
        About
      </LinkText>
    </Link>
    <Link href='/projects'>
      <LinkText>
        Projects
      </LinkText>
    </Link>
    <Link href="https://github.com/henrixounez" passHref={true}>
      <IconContainer>
        <Icon src='/github-icon.svg'/>
      </IconContainer>
    </Link>
  </LinksContainer>
);

const SvgLogo = () => (
  <Link href='/'>
    <MainSvg>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor: "#7928CA"}}/>
        <stop offset="100%" style={{stopColor: "#FF0080"}}/>
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor: "#007CF0"}}/>
        <stop offset="100%" style={{stopColor: "#00DFD8"}}/>
      </linearGradient>
      <MainG>
        <g transform="translate(-22.401571,-43.010736)">
          <path
            d="M 0 0 L 0 30.095703 L 0.50195312 30.095703 L 8.9023438 30.095703 L 8.9023438 18.728516 L 18.351562 18.728516 L 18.351562 30.095703 L 26.25 30.095703 L 27.253906 30.095703 L 35.085938 30.095703 L 35.085938 17.326172 C 35.092363 16.340241 35.374179 15.604977 35.824219 15.117188 C 36.274247 14.629398 36.912352 14.349609 37.773438 14.349609 C 38.650337 14.349609 39.27228 14.627617 39.707031 15.111328 C 40.141779 15.595021 40.40104 16.329389 40.394531 17.318359 L 40.394531 30.095703 L 48.230469 30.095703 L 49.236328 30.095703 L 57.068359 30.095703 L 57.068359 18.226562 C 57.068359 15.955735 58.525403 14.580078 60.603516 14.580078 C 61.360547 14.580078 62.677156 14.719575 63.341797 14.949219 L 63.998047 15.177734 L 63.998047 9.8046875 L 68.712891 18.675781 L 62.230469 30.095703 L 71.236328 30.095703 L 74.521484 23.740234 L 77.902344 30.095703 L 85.134766 30.095703 L 86.783203 30.095703 L 93.978516 30.095703 L 93.978516 17.326172 C 93.984941 16.340241 94.258956 15.604977 94.708984 15.117188 C 95.159009 14.629398 95.797117 14.349609 96.658203 14.349609 C 97.535103 14.349609 98.164858 14.627617 98.599609 15.111328 C 99.034357 15.595021 99.293614 16.329389 99.287109 17.318359 L 99.287109 30.095703 L 107.12891 30.095703 L 108.13086 30.095703 L 127.2832 30.095703 L 127.2832 23.126953 L 118.68945 23.126953 L 126.93555 12.71875 L 126.93555 7.2714844 L 107.46875 7.2714844 L 107.46875 11.986328 C 107.09898 11.036304 106.58522 10.18072 105.92969 9.4628906 C 104.50862 7.9067835 102.44882 6.9902344 100.00977 6.9902344 C 97.09352 6.9902344 94.858405 8.5291791 93.580078 10.792969 L 93.580078 7.2714844 L 86.480469 7.2714844 L 85.134766 7.2714844 L 77.548828 7.2714844 L 74.521484 13.382812 L 71.642578 7.2714844 L 71.326172 7.2714844 L 63.478516 7.2714844 C 62.856434 7.1018189 62.190174 6.9902344 61.511719 6.9902344 C 60.249391 6.9902344 59.078417 7.3741946 58.138672 8.1796875 C 57.547765 8.686182 57.235762 9.6291464 56.845703 10.453125 L 56.845703 7.2714844 L 48.230469 7.2714844 L 48.230469 11.212891 C 47.904367 10.571231 47.509075 9.979708 47.037109 9.4628906 C 45.616045 7.9067835 43.564054 6.9902344 41.125 6.9902344 C 38.206037 6.9902344 35.964806 8.5312212 34.6875 10.798828 L 34.6875 7.2714844 L 27.246094 7.2714844 L 27.253906 0 L 18.351562 0 L 18.351562 11.367188 L 8.9023438 11.367188 L 8.9023438 0 L 0 0 z "
            transform="matrix(0.26458333,0,0,0.26458333,22.766577,46.84375)"
          />
        </g>
      </MainG>
    </MainSvg>
  </Link>
);

const TopBar = () => {
  const bg = useRef<HTMLDivElement | null>(null);

  const onScroll = (_: Event) => {
    if (bg && bg.current !== null) {
      bg.current.style.background = window.scrollY > 80 ? '#000A' : '#0000';
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll, false);
    return () => {
      window.removeEventListener('scroll', onScroll, false);
    }
  }, []);

  return (
    <>
      <TopBarBackground ref={bg}/>
      <TopBarContainer>
        <SvgLogo/>
        <Links/>
      </TopBarContainer>
    </>
  );
};

export default TopBar;