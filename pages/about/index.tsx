import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Page from "../../components/Page";

const Container = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

const TextContainer = styled.div<{gravity: boolean}>`
  font-family: Inter;
  color: white;
  position: absolute;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: space-around;

  width: 100vw;

  ${({gravity}) => !gravity ? `
    width: 90vw;
    max-width: 1280px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  ` : `
    top: 0;
    left: 0;
    height: 100vh;
  `}
`;

const Text = styled.div<{weight: number}>`
  font-weight: ${({weight}) => weight};
  font-size: 5vmin;
`;

const JumpingContainer = styled.div<{gravity: boolean}>`
  user-select: none;
  ${({gravity}) => gravity ? `
    cursor: pointer;
    position: absolute;
  ` : `
    transition: 200ms;
  `}
`;

const GradientLine = styled.div`
  height: 1px;
  width: 90vw;
  max-width: 1280px;
  background: linear-gradient(90deg, #7928CA, #FF0080);
  transition: 1000ms;
`;

const GravityButton = styled.div`
  font-family: Inter;
  font-weight: 700;
  color: white;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  cursor: pointer;
  user-select: none;
`;

const intervalTime = 50;

interface JumpingProps {
  gravity: boolean;
}
const Jumping: FunctionComponent<JumpingProps> = ({gravity, children}) => {
  const velocityX = useRef(Math.random() * 20 - 10);
  const velocityY = useRef(Math.random() * -50);
  const posX = useRef(0);
  const posY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);


  function getPos() {
    if (!containerRef.current)
      return {x: 0, y: 0};
    const boundingClientRect = containerRef.current.getBoundingClientRect();
    return {
      x: boundingClientRect.x,
      y: boundingClientRect.y,
    };
  }

  function simulateGravity() {
    if (!gravity)
      return;
    let newVX = velocityX.current;
    let newVY = velocityY.current + 9.81 * (intervalTime / 100);

    if (newVY > 100)
      newVY = 100;
    let newPosX = posX.current + newVX * (intervalTime / 100);
    let newPosY = posY.current + newVY * (intervalTime / 100);
    if (newPosX < 0) {
      newPosX = 0;
      newVX = - newVX / 2;
    }
    if (newPosX + (containerRef.current?.clientWidth || 0) > window.innerWidth) {
      newPosX = window.innerWidth - (containerRef.current?.clientWidth || 0);
      newVX = - newVX / 2;
    }
    if (newPosY + (containerRef.current?.clientHeight || 0) > window.innerHeight) {
      newPosY = window.innerHeight - (containerRef.current?.clientHeight || 0);
      newVY = - newVY / 2;
      newVX = newVX / 2;
    }
    if (newPosX === posX.current && newPosY === posY.current)
      return;

    if (containerRef && containerRef.current !== null) {
      containerRef.current.style.left = `${newPosX}px`;
      containerRef.current.style.top = `${newPosY}px`;
    }

    velocityX.current = newVX;
    velocityY.current = newVY;
    posX.current = newPosX;
    posY.current = newPosY;
  }

  useEffect(() => {
    const {x, y} = getPos();
    posX.current = x;
    posY.current = y;
    if (containerRef && containerRef.current !== null) {
      containerRef.current.style.left = `${posX.current}px`;
      containerRef.current.style.top = `${posY.current}px`;
    }

    if (gravity) {
      velocityX.current = Math.random() * 20 - 10;
      velocityY.current = Math.random() * -50;
      if (interval.current)
        clearInterval(interval.current);
      interval.current = setInterval(simulateGravity, intervalTime);
    }
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    }
  }, [gravity]);

  return (
    <JumpingContainer
      gravity={gravity}
      ref={containerRef}
      onClick={() => {
        velocityY.current = -80 - (Math.random() * 50);
        velocityX.current = (Math.random() - 0.5) * 50;
      }}
    >
      {children}
    </JumpingContainer>
  );
}

const texts = [
  {text: "Front-End", weight: 200},
  {text: "Full-Stack", weight: 800},
  {text: "Back-End", weight: 300},
  {text: "Student", weight: 100},
  {text: "21 Years Old", weight: 100},
  {text: "Developper", weight: 900},
  {text: "Javascript", weight: 200},
  {text: "Typescript", weight: 400},
  {text: "React.js", weight: 700},
  {text: "Dart", weight: 200},
  {text: "Next.js", weight: 800},
  {text: "Node.js", weight: 500},
  {text: "Express.js", weight: 300},
  {text: "GraphQL", weight: 600},
  {text: "Flutter", weight: 200},
]

export default function About() {
  const [gravity, setGravity] = useState(false);

  return (
    <Page>
      <Container>
        <TextContainer gravity={gravity}>
          {texts.map((text, i) => (
            <Jumping key={i} gravity={gravity}>
              <Text weight={text.weight}>
                {text.text}
              </Text>
            </Jumping>
          ))}
          {!gravity && <GradientLine/>}
        </TextContainer>
        <GravityButton onClick={() => {
          setGravity(!gravity);
        }}>
          Gravity:&nbsp;{gravity ? 'ON' : 'OFF'}
        </GravityButton>
      </Container>
    </Page>
  )
}