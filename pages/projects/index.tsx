import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { bpdw, BreakpointSizes } from '../../components/breakpoints';
import { GradientTitle } from '../../components/GradientTitle';
import Page from "../../components/Page";

const CenteredList = styled.div`
  display: flex;
  flex-direction: column;
  width: 90vw;
  max-width: 1280px;
  margin: auto;
  margin-top: 20vh;
  gap: 1rem;
  align-items: center;
`;

const ProjectRow = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Inter;
  align-items: center;
  justify-content: space-between;
  max-width: 90vw;
  width: 900px;
`;

const ProjectTitleContainer = styled.div`
  position: relative;
`;
const CustomGradientTitle = styled(GradientTitle)`
  font-weight: 800 !important;
  font-size: 2rem !important;
  cursor: pointer;
  transition: 500ms;
  ${bpdw(BreakpointSizes.md)} {
    font-size: 1.5rem;
  }
`;
const Title = styled.div`
  position: absolute;
  top: 0;
  font-weight: 800;
  font-size: 2rem;
  cursor: pointer;
  transition: 500ms;
  &:hover {
    opacity: 0;
  }
  ${bpdw(BreakpointSizes.md)} {
    font-size: 1.5rem;
  }
`;
const ProjectDescription = styled.div`
  font-weight: 300;
  font-size: 1rem;
  text-align: right;
  color: white;
`;

const projectList = [
  {
    title: 'Space Tracker',
    description: 'Space events calendar 🚀',
    link: '/spacetracker',
  },
  // {
  //   title: 'Collaborative Coding',
  //   description: 'Online coding experience 🧑‍💻',
  //   // link: '/coding',
  // },
  // {
  //   title: 'Spotify Cities',
  //   description: 'Find out where your music is most listened from 🎶',
  //   // link: '/spotify',
  // },
  // {
  //   title: 'Geometry',
  //   description: 'Geometry visualisations 📐',
  //   // link: '/geometry',
  // },
  // {
  //   title: 'Workshops',
  //   description: 'Little coding workshops 💻',
  //   // link: '/workshops'
  // }
]

interface ProjectTitleProps {
  title: string,
  link?: string,
}
const ProjectTitle: FunctionComponent<ProjectTitleProps> = ({title, link}) => (
  <Link href={link || '/projects'}>
    <ProjectTitleContainer>
      <Title>
        {title}
      </Title>
      <CustomGradientTitle>
        {title}
      </CustomGradientTitle>
    </ProjectTitleContainer>
  </Link>
)

export default function Projects() {
  return (
    <Page>
      <CenteredList>
        {projectList.map((project, i) => (
          <ProjectRow key={i}>
            <ProjectTitle title={project.title} link={project.link}/>
            <ProjectDescription>
              {project.description}
            </ProjectDescription>
          </ProjectRow>
        ))}
        <ProjectRow style={{marginTop: '10rem'}}>
          <ProjectTitle title="... more to come"/>
          <ProjectDescription>
            Still in the process of being imported from old website 🧑‍💻
          </ProjectDescription>
        </ProjectRow>
      </CenteredList>
    </Page>
  )
}