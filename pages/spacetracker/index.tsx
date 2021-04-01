import { FunctionComponent, useEffect, useRef, useState } from "react";
import styled               from 'styled-components';
import { useSWRInfinite }   from "swr";
import { parseISO, format } from 'date-fns'
import Page                 from "../../components/Page";
import { bpdw, BreakpointSizes } from "../../components/breakpoints";

const PAGE_SIZE = 12;
const URL = `https://ll${process.env.NODE_ENV === 'development' ? 'dev' : ''}.thespacedevs.com/2.0.0/launch/upcoming`;

const fetcher = (url: string) => fetch(url).then(r => r.json())

const Content = styled.div`
  position: relative;
`;
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95vw;
  max-width: 1280px;
  margin: auto;
  margin-top: 15vh;
  gap: 2rem;
  z-index: 2;
  ${bpdw(BreakpointSizes.md)} {
    align-items: center;
  }
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  background: #0C0C0C;
  border-radius: 1rem;
  overflow: hidden;
  &:hover {
    background: #111;
  }
  ${bpdw(BreakpointSizes.md)} {
    flex-direction: column;
    align-items: center;
    width: 90vw;
    text-align: center;
  }
`;
const ItemContent = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  width: 100%;
  max-width: 95vw;
  ${bpdw(BreakpointSizes.md)} {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 1rem 2rem;
  }
`;
const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 1rem;
  ${bpdw(BreakpointSizes.md)} {
    align-items: center;
  }
`;
const EndColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  ${bpdw(BreakpointSizes.md)} {
    align-items: center;
  }
`;


const RocketImage = styled.img`
  object-fit: cover;
  height: 10rem;
  width: 10rem;
  min-width: 10rem;
  min-height: 10rem;
  ${bpdw(BreakpointSizes.md)} {
    height: 95vw;
    width: 95vw;
    min-width: 95vw;
    min-height: 95vw;
  }
`;
const Name = styled.h1`
  margin: 0;
  font-family: Inter;
  font-weight: 700;
  font-size: 1.5rem;
`;
const Info = styled.div`
  font-family: Inter;
  font-weight: 200;
  font-size: 1rem;
`;
const LoadingInfo = styled.div`
  font-family: Inter;
  font-weight: 400;
  font-size: 2rem;
  margin: 3rem auto;
`;
const CountdownDisplay = styled.div`
  font-family: Inter;
  font-weight: 500;
  font-size: 1.5rem;
`;

interface LaunchData {
  name: string,
  image?: string,
  window_start?: string,
  window_end?: string,
  net: string,
  mission?: {
    name: string,
    description: string
  },
  rocket?: {
    configuration?: {
      name: string
    }
  },
  launch_service_provider?: {
    name: string
  },
  pad?: {
    name: string,
    location?: {
      name: string
    }
  },
  status: {
    id: number
  }
}

interface DateStringProps {
  timeString: string,
  precise?: boolean,
  day?: boolean,
  parentheses?: boolean
}
const DateString: FunctionComponent<DateStringProps> = ({ timeString, precise, day, parentheses }) => {
  if (!timeString)
    return <time>''</time>
  const date = parseISO(timeString)
  return (
    <time dateTime={timeString}>
      {parentheses && '('}{format(date, (day ? 'eee ' : '') + 'LLLL d, yyyy' + (precise ? ' HH:mm' : ''))}{parentheses && ')'}
    </time>
  );
}

interface CountdownProps {
  timeString: string
}
const Countdown: FunctionComponent<CountdownProps> = ({timeString}) => {
  const [duration, setDuration] = useState((new Date(timeString)).getTime() - new Date().getTime());

  useEffect(() => {
    const from = new Date(timeString);
    const now = new Date();
    setDuration((from.getTime() - now.getTime()));
  }, [timeString]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(duration => duration < 1000 ? 0 : duration - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const padNumber = (number: number) => (number < 10 ? '0' : '') + number.toString();

  const getDurationString = (durationNb: number) => {
    const days = Math.floor(durationNb / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationNb % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
    const minutes = Math.floor((durationNb % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationNb % (1000 * 60)) / 1000);

    return `${padNumber(days)}:${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
  } 

  return (
    <>
      {getDurationString(duration)}
    </>
  );
}

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function createCanvas() {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      const context = canvasRef.current.getContext("2d");

      if (context !== null) {
        const starNb = 400;
        for (let i = 0; i < starNb; i++) {
          const x = Math.random() * canvasRef.current.offsetWidth;
          const y = Math.random() * canvasRef.current.offsetHeight;
          const radius = Math.random() * 1.5;
          context.beginPath();
          context.arc(x, y, radius, 0, 360);
          context.fillStyle = "white";
          context.fill();
        }
      }

    }
  }

  useEffect(() => {
    window.addEventListener('resize', createCanvas, false);
    createCanvas();
    return () => {
      window.removeEventListener('resize', createCanvas, false);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        background: '#0A0A0A',
        position: 'fixed',
        top: 0,
      }}
      width="100vw"
      height="100vh"
    />
  )
}

export default function SpaceTracker() {
  const { data, error, size, setSize } = useSWRInfinite((index, previousData) => {
    if (!!previousData && index * PAGE_SIZE > previousData.count)
      return null;
    return `${URL}/?limit=${PAGE_SIZE}&offset=${index * PAGE_SIZE}`;
  }, fetcher)
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.results?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.results?.length < PAGE_SIZE);

  const handleScroll = () => {
    if (isLoadingMore || isReachingEnd)
      return;
    const lastLoaded: HTMLDivElement | null = document.querySelector('#launchlist > .launch:last-child')
    if (lastLoaded) {
      const lastLoadedOffset = lastLoaded.offsetTop + lastLoaded.clientHeight;
      const pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset >= lastLoadedOffset)
        setSize(size + 1)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  });

  const launchData: Array<LaunchData> = !data ? [] : data.reduce((acc, e) => {e.results && acc.push(...e.results); return acc}, []).flat().filter((e: LaunchData) => ![3, 4, 7].includes(e.status.id));

  return (
    <Page noShowBg>
      <StarCanvas/>
      <Content>
        <ListContainer id="launchlist">
          {data && data[0] && data[0].detail && (
            <LoadingInfo>
              Error fetching data:<br/>
              {data[0].detail}
            </LoadingInfo>
          )}
          {launchData.map((launch, i) => (
            <ListItem className="launch" key={i}>
              <RocketImage src={launch.image || '/empty-img.jpg'}/>
              <ItemContent>
                <MainColumn>
                  <div>
                    <Name>{launch.name}</Name>
                    <Info>{launch.launch_service_provider?.name}</Info>
                  </div>
                  <Info>{launch.pad?.name} ({launch.pad?.location?.name})</Info>
                </MainColumn>
                <EndColumn>
                  <CountdownDisplay>
                    <Countdown timeString={launch.window_start || launch.window_end || launch.net}/>
                  </CountdownDisplay>
                  <Info>
                    <DateString timeString={launch.window_start || launch.window_end || launch.net} day precise parentheses/>
                  </Info>
                </EndColumn>
              </ItemContent>
            </ListItem>
          ))}
          {isLoadingMore && (
            <LoadingInfo>
              Loading...
            </LoadingInfo>
          )}
        </ListContainer>
      </Content>
    </Page>
  );
}