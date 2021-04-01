import styled                     from 'styled-components';
import { bpdw, BreakpointSizes }  from "./breakpoints";

export const GradientTitle = styled.h1`
  margin: 0;
  width: fit-content;

  font-family: Inter;
  font-size: 5rem;
  font-weight: 900;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(90deg, #7928CA, #FF0080);
  ${bpdw(BreakpointSizes.md)} {
    font-size: 2.5rem;
  }
`;