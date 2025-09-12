import type { Project } from "~/types";
import { ref, get, onValue } from "firebase/database";

const load = async () => {
  const { getDb } = await import("~/utils/firebase.client");
  const db = await getDb();
  const projects = ref(db, "projects");
  const res = (await get(projects)).val() as any;
  _projects = res
    ? Object.keys(res)?.map((key: string) => {
        return { ...res[key], id: key } as Project;
      })
    : [];

  onValue(projects, (snapshot) => {
    const res = snapshot.val();
    _projects = res
      ? Object.keys(res)?.map((key: string) => {
          return { ...res[key], id: key } as Project;
        })
      : [];
  });

  return _projects;
};

let _projects: Project[];

export const fetchProjects = async (): Promise<Project[]> => {
  _projects = _projects || load();

  return await _projects;
};

export const findProjectBySlug = async (
  slug: string
): Promise<Project | null> => {
  if (!slug) return null;

  return _projects?.find((item) => item.slug === slug) as Project;
};
