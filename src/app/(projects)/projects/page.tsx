import { getProjects } from "@/services/projects";
import { ProjectsShowcase } from "./projects-showcase";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsShowcase projects={projects} />;
}
