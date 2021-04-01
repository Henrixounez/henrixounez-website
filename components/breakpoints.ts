export enum BreakpointSizes {
  sm,
  md,
  lg,
  xl
};

const breakpoints = {
  [BreakpointSizes.sm]: 576,
  [BreakpointSizes.md]: 768,
  [BreakpointSizes.lg]: 992,
  [BreakpointSizes.xl]: 1200
};

export const bpdw = (bp: BreakpointSizes) => `@media (max-width: ${breakpoints[bp]}px)`;

export const bpup = (bp: BreakpointSizes) => `@media (min-width: ${breakpoints[bp]}px)`;

