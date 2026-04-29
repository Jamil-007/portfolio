"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { getFirebaseServices } from "./firebase";
import type { BlogPost, PortfolioData, PortfolioSettings, Profile, Project, SettingsOption, SkillSetting, Technology } from "./types";
import { emptyPortfolioData, emptyProfile } from "./empty-data";

function clean<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== ""),
  ) as T;
}

function snapshotToList<T extends { id: string }>(snapshot: QuerySnapshot<DocumentData>) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

function normalizeSettings(settings?: Partial<PortfolioSettings>): PortfolioSettings {
  return {
    projectTypes: (settings?.projectTypes ?? []).map(cleanSettingsOption),
    projectRoles: (settings?.projectRoles ?? []).map(cleanSettingsOption),
    skills: (settings?.skills ?? []).map(cleanSkillSetting),
  };
}

function cleanSettingsOption(option: SettingsOption): SettingsOption {
  return {
    id: option.id,
    label: option.label,
  };
}

function cleanSkillSetting(skill: SkillSetting): SkillSetting {
  return {
    id: skill.id,
    name: skill.name,
    iconKey: skill.iconKey,
  };
}

function handlePublicReadError(source: string, emit: () => void) {
  return (error: Error) => {
    console.warn(`Firestore public read failed for ${source}. Using demo fallback.`, error.message);
    emit();
  };
}

function handleAdminReadError(source: string) {
  return (error: Error) => {
    console.warn(`Firestore admin read failed for ${source}.`, error.message);
  };
}

export function subscribeToPortfolioData(callback: (data: PortfolioData) => void) {
  const services = getFirebaseServices();

  if (!services) {
    callback(emptyPortfolioData);
    return () => undefined;
  }

  let projects = emptyPortfolioData.projects;
  let blogPosts = emptyPortfolioData.blogPosts;
  let technologies = emptyPortfolioData.technologies;
  let profile = emptyPortfolioData.profile;
  let settings = emptyPortfolioData.settings;

  const emit = () => callback({ projects, blogPosts, technologies, profile, settings });

  const unsubProjects = onSnapshot(
    query(collection(services.db, "projects"), where("visibility", "==", "published")),
    (snapshot) => {
      projects = snapshotToList<Project>(snapshot);
      emit();
    },
    handlePublicReadError("projects", emit),
  );
  const unsubBlog = onSnapshot(
    query(collection(services.db, "blogPosts"), where("status", "==", "published")),
    (snapshot) => {
      blogPosts = snapshotToList<BlogPost>(snapshot);
      emit();
    },
    handlePublicReadError("blogPosts", emit),
  );
  const unsubTech = onSnapshot(
    collection(services.db, "technologies"),
    (snapshot) => {
      technologies = snapshotToList<Technology>(snapshot);
      emit();
    },
    handlePublicReadError("technologies", emit),
  );
  const unsubProfile = onSnapshot(
    doc(services.db, "profile", "main"),
    (snapshot) => {
      if (snapshot.exists()) {
        profile = snapshot.data() as Profile;
        emit();
      }
    },
    handlePublicReadError("profile/main", emit),
  );
  const unsubSettings = onSnapshot(
    doc(services.db, "settings", "options"),
    (snapshot) => {
      settings = snapshot.exists() ? normalizeSettings(snapshot.data() as Partial<PortfolioSettings>) : emptyPortfolioData.settings;
      emit();
    },
    handlePublicReadError("settings/options", emit),
  );

  return () => {
    unsubProjects();
    unsubBlog();
    unsubTech();
    unsubProfile();
    unsubSettings();
  };
}

export function subscribeToAdminData(callback: (data: PortfolioData) => void) {
  const services = getFirebaseServices();

  if (!services) {
    callback(emptyPortfolioData);
    return () => undefined;
  }

  let projects = emptyPortfolioData.projects;
  let blogPosts = emptyPortfolioData.blogPosts;
  let technologies = emptyPortfolioData.technologies;
  let profile = emptyPortfolioData.profile;
  let settings = emptyPortfolioData.settings;

  const emit = () => callback({ projects, blogPosts, technologies, profile, settings });

  const unsubProjects = onSnapshot(
    query(collection(services.db, "projects"), orderBy("title")),
    (snapshot) => {
      projects = snapshotToList<Project>(snapshot);
      emit();
    },
    handleAdminReadError("projects"),
  );
  const unsubBlog = onSnapshot(
    query(collection(services.db, "blogPosts"), orderBy("title")),
    (snapshot) => {
      blogPosts = snapshotToList<BlogPost>(snapshot);
      emit();
    },
    handleAdminReadError("blogPosts"),
  );
  const unsubTech = onSnapshot(
    query(collection(services.db, "technologies"), orderBy("name")),
    (snapshot) => {
      technologies = snapshotToList<Technology>(snapshot);
      emit();
    },
    handleAdminReadError("technologies"),
  );
  const unsubProfile = onSnapshot(
    doc(services.db, "profile", "main"),
    (snapshot) => {
      if (snapshot.exists()) {
        profile = snapshot.data() as Profile;
        emit();
      }
    },
    handleAdminReadError("profile/main"),
  );
  const unsubSettings = onSnapshot(
    doc(services.db, "settings", "options"),
    (snapshot) => {
      settings = snapshot.exists() ? normalizeSettings(snapshot.data() as Partial<PortfolioSettings>) : emptyPortfolioData.settings;
      emit();
    },
    handleAdminReadError("settings/options"),
  );

  return () => {
    unsubProjects();
    unsubBlog();
    unsubTech();
    unsubProfile();
    unsubSettings();
  };
}

export async function getProjectBySlug(slug: string) {
  const services = getFirebaseServices();
  if (!services) {
    return null;
  }

  return new Promise<Project | null>((resolve) => {
    const unsubscribe = onSnapshot(
      query(collection(services.db, "projects"), where("slug", "==", slug)),
      (snapshot) => {
        unsubscribe();
        resolve(snapshot.empty ? null : ({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project));
      },
    );
  });
}

export async function saveProject(project: Partial<Project> & Omit<Project, "id">, id?: string) {
  const services = getFirebaseServices();
  if (!services) {
    throw new Error("Firebase is not configured.");
  }

  const payload = clean({
    ...project,
    updatedAt: new Date().toISOString(),
  });

  if (id) {
    await updateDoc(doc(services.db, "projects", id), payload);
    return id;
  }

  const created = await addDoc(collection(services.db, "projects"), {
    ...payload,
    createdAt: new Date().toISOString(),
  });
  return created.id;
}

export async function deleteProject(id: string) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(services.db, "projects", id));
}

export async function saveBlogPost(post: Partial<BlogPost> & Omit<BlogPost, "id">, id?: string) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");

  const payload = clean({ ...post, updatedAt: new Date().toISOString() });

  if (id) {
    await updateDoc(doc(services.db, "blogPosts", id), payload);
    return id;
  }

  const created = await addDoc(collection(services.db, "blogPosts"), {
    ...payload,
    createdAt: new Date().toISOString(),
  });
  return created.id;
}

export async function deleteBlogPost(id: string) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(services.db, "blogPosts", id));
}

export async function saveTechnology(technology: Partial<Technology> & Omit<Technology, "id">, id?: string) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");

  if (id) {
    await updateDoc(doc(services.db, "technologies", id), clean(technology));
    return id;
  }

  const created = await addDoc(collection(services.db, "technologies"), clean(technology));
  return created.id;
}

export async function deleteTechnology(id: string) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(services.db, "technologies", id));
}

export async function saveProfile(profile: Profile) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");

  await setDoc(doc(services.db, "profile", "main"), profile, { merge: true });
}

export async function savePortfolioSettings(settings: PortfolioSettings) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");

  await setDoc(doc(services.db, "settings", "options"), {
    ...normalizeSettings(settings),
    updatedAt: new Date().toISOString(),
  });
}

export async function getProfileOnce() {
  const services = getFirebaseServices();
  if (!services) return emptyProfile;

  const snapshot = await getDoc(doc(services.db, "profile", "main"));
  return snapshot.exists() ? (snapshot.data() as Profile) : emptyProfile;
}
