const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// ── Session Testeur / Utilisateur ────────────────────────────────────
const TOKEN_KEY = "samre_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Session Administrateur Dédiée & Indépendante ─────────────────────
const ADMIN_TOKEN_KEY = "samre_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getImageUrl(path?: string | null): string {
  if (!path || path.trim() === "") return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Client HTTP générique pour le testeur
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    throw new ApiError("Session expirée. Reconnectez-vous.", 401);
  }

  const text = await res.text();
  let data: any = null;

  if (text) {
    const trimmed = text.trim();
    const isJsonLike = trimmed.startsWith("{") || trimmed.startsWith("[");

    if (isJsonLike) {
      try {
        data = JSON.parse(trimmed);
      } catch {
        throw new ApiError(
          "Le serveur a répondu avec une erreur de format JSON.",
          res.status
        );
      }
    } else {
      const plainText = trimmed
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const sanitized = plainText.slice(0, 220) || "Réponse serveur non valide.";

      if (/SQLSTATE|No connection could be made|actively refused|Internal Server Error/i.test(sanitized)) {
        data = {
          message:
            "La base de données n'est pas disponible. Démarrez MySQL/WAMP puis réessayez.",
        };
      } else {
        data = { message: sanitized };
      }
    }
  }

  if (!res.ok) {
    const message =
      data?.error ??
      data?.message ??
      data?.errors ??
      (res.status === 404
        ? "Le serveur d'authentification est introuvable. Vérifiez que l'API est démarrée."
        : "Une erreur est survenue.");

    throw new ApiError(
      typeof message === "string" ? message : "Une erreur est survenue.",
      res.status
    );
  }

  return data as T;
}

// Client HTTP dédié à l'espace Administrateur (utilise samre_admin_token)
async function adminRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const adminToken = getAdminToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (adminToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${adminToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearAdminToken();
    throw new ApiError("Session administrateur expirée. Reconnectez-vous.", 401);
  }

  const text = await res.text();
  let data: any = null;

  if (text) {
    const trimmed = text.trim();
    const isJsonLike = trimmed.startsWith("{") || trimmed.startsWith("[");

    if (isJsonLike) {
      try {
        data = JSON.parse(trimmed);
      } catch {
        throw new ApiError(
          "Le serveur a répondu avec une erreur de format JSON.",
          res.status
        );
      }
    } else {
      const plainText = trimmed
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const sanitized = plainText.slice(0, 220) || "Réponse serveur non valide.";

      if (/SQLSTATE|No connection could be made|actively refused|Internal Server Error/i.test(sanitized)) {
        data = {
          message:
            "La base de données n'est pas disponible. Démarrez MySQL/WAMP puis réessayez.",
        };
      } else {
        data = { message: sanitized };
      }
    }
  }

  if (!res.ok) {
    const message =
      data?.error ??
      data?.message ??
      data?.errors ??
      (res.status === 404
        ? "Le serveur d'administration est introuvable. Vérifiez que l'API est démarrée."
        : "Une erreur est survenue.");

    throw new ApiError(
      typeof message === "string" ? message : "Une erreur est survenue.",
      res.status
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export const adminHttp = {
  get: <T>(path: string) => adminRequest<T>(path),
  post: <T>(path: string, body?: unknown) =>
    adminRequest<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    adminRequest<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    adminRequest<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => adminRequest<T>(path, { method: "DELETE" }),
};

// ── Types correspondant aux réponses du backend Symfony ──────────────

export type User = {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  telephone?: string;
  photo?: string;
  statut?: string;
  pays?: string;
  ville?: string;
  genre?: string;
};

export type Mission = {
  id: number;
  titre: string;
  description: string;
  objectif?: string;
  image?: string;
  application: string;
  versionApplication?: string;
  platforme?: string;
  lienApplication?: string;
  duree?: number;
  dureEstime?: string;
  remuneration?: number | string;
  statut: string;
  nombreParticipantsSouhaites?: number;
  conditionsParticipation?: string;
  etapes?: Etape[];
};

export type Participation = {
  id: number;
  mission: Mission;
  panelisteUid?: string;
  statut: string;
  progression: number;
  etapesCompletees: number;
  etapesTotal: number;
  contratAccepte: boolean;
  dateCreation?: string;
  dateDebut?: string;
  dateFin?: string;
};

export type Etape = {
  id: number;
  titre: string;
  description?: string;
  instructions: string;
  ordre: number;
  jour?: number;
  resultatAttendu?: string;
  besoinReference?: boolean;
  dureeEstimee?: string;
  statut: string;
};

export type Reference = {
  id: number;
  reference: string;
  statut: string;
  dateGeneration?: string;
  dateExpiration?: string;
  dateValidation?: string;
  referenceSaisie?: string;
  panelisteUid?: string;
  jour?: number;
  apiKey?: string;
};

export type NotificationItem = {
  id: number;
  titre: string;
  message: string;
  type: string;
  lu: boolean;
  dateCreation: string;
};

export type FeedbackPayload = {
  participationId: number;
  note: number;
  faciliteUtilisation: string;
  pointsPositifs?: string;
  problemes?: string;
  difficultes?: string;
  ameliorations?: string;
  commentaires?: string;
};

// ── Endpoints ────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string }>("/api/login", { email, password }),
  register: (data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
  }) => api.post<User>("/api/register", data),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/api/forgot-password", { email }),
  me: () => api.get<User>("/api/me"),
};

export const missionsApi = {
  list: () => api.get<Mission[]>("/api/missions"),
  show: (id: number) => api.get<Mission>(`/api/missions/${id}`),
};

export const participationsApi = {
  mine: () => api.get<Participation[]>("/api/participations"),
  join: (missionId: number, contratAccepte: boolean) =>
    api.post<Participation>(`/api/participations/mission/${missionId}`, {
      contratAccepte,
    }),
  start: (id: number) =>
    api.post<Participation>(`/api/participations/${id}/start`),
};

export const etapesApi = {
  byMission: (missionId: number) =>
    api.get<Etape[]>(`/api/etapes/mission/${missionId}`),
};

export type DailyCodeInfo = {
  hasActiveMission: boolean;
  code: string;
  missionTitre?: string | null;
  application?: string | null;
  jour: number;
  statut: string;
  date: string;
  dateKey: string;
  panelisteUid: string;
};

export const referencesApi = {
  forEtape: (etapeId: number) =>
    api.get<Reference>(`/api/references/etape/${etapeId}`),
  getDailyCode: () => api.get<DailyCodeInfo>("/api/references/daily-code"),
  validate: (etapeId: number, reference: string) =>
    api.post<{
      valid: boolean;
      message?: string;
      progression?: number;
      participation?: Participation;
    }>("/api/references/validate", {
      etapeId,
      reference,
    }),
};


export const feedbackApi = {
  create: (data: FeedbackPayload) =>
    api.post<{ id: number }>("/api/feedback", data),
};

export const profileApi = {
  show: () => api.get<User>("/api/profile"),
  update: (data: {
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    photo?: string;
    pays?: string;
    ville?: string;
    genre?: string;
  }) => api.put<User>("/api/profile", data),
};

export const notificationsApi = {
  list: () => api.get<NotificationItem[]>("/api/notifications"),
  markRead: (id: number) => api.patch(`/api/notifications/${id}/read`),
  markAllRead: () => api.patch("/api/notifications/read-all"),
};

export type AdminMissionEtape = {
  id: number;
  titre: string;
  instruction: string;
  description?: string;
  ordre: number;
  jour: number;
  besoinReference: boolean;
  codeReference?: string | null;
  resultatAttendu?: string;
  dureeEstimee?: string;
  statut?: string;
};

export type AdminMission = {
  id: number;
  titre: string;
  application: string;
  applicationId?: number;
  versionApplication?: string;
  platforme: string;
  image?: string | null;
  statut: string;
  dureEstime: string;
  remuneration?: string;
  lienApplication: string;
  description: string;
  objectif?: string;
  conditionsParticipation?: string;
  dateDebut?: string;
  dateFin?: string;
  dateCreation: string;
  nombreParticipants: number;
  nombreParticipantsSouhaites?: number;
  nombreEtapes: number;
  nombreJours: number;
  etapes: AdminMissionEtape[];
};

export type MissionPayload = {
  titre: string;
  application: string;
  applicationId?: number;
  versionApplication?: string;
  platforme: string;
  image?: string | null;
  lienApplication?: string;
  dureEstime: string;
  remuneration?: string;
  nombreParticipantsSouhaites?: number;
  description: string;
  objectif?: string;
  conditionsParticipation?: string;
  statut?: string;
  dateDebut?: string;
  dateFin?: string;
  etapes?: {
    jour: number;
    ordre: number;
    titre: string;
    instruction: string;
    besoinReference?: boolean;
    referenceCode?: string;
    resultatAttendu?: string;
    dureeEstimee?: string;
  }[];
};

export type AdminParticipation = {
  id: number;
  testeurId?: number;
  testeurNom: string;
  testeurEmail: string;
  testeurTelephone?: string;
  testeurPhoto?: string | null;
  panelisteUid?: string;
  missionId?: number;
  missionTitre: string;
  application: string;
  image?: string | null;
  statut: string;
  progression: number;
  etapesCompletees: number;
  etapesTotal: number;
  jourActuel?: number;
  totalJours?: number;
  dateDebut?: string;
  contratAccepte: boolean;
  dateCreation?: string;
};

export type ParticipationDetail = {
  id: number;
  panelisteUid?: string;
  statut: string;
  progression: number;
  contratAccepte: boolean;
  dateDebut?: string;
  dateFin?: string;
  testeur: {
    id?: number;
    nom: string;
    email?: string;
    telephone?: string;
    statut?: string;
    photo?: string | null;
  };
  mission: {
    id?: number;
    titre?: string;
    application?: string;
    lienApplication?: string;
    dureEstime?: string;
  };
  etapes: {
    id: number;
    titre: string;
    jour: number;
    ordre: number;
    instruction: string;
    besoinReference: boolean;
    referenceAttendue?: string | null;
    referenceSaisie?: string | null;
    statutValidation: string;
    dateValidation?: string | null;
  }[];
};

export type AdminFeedback = {
  id: number;
  note: number;
  faciliteUtilisation: number;
  pointsPositifs?: string;
  problemes?: string;
  difficultes?: string;
  ameliorations?: string;
  commentaires?: string;
  dateCreation?: string;
  testeurNom: string;
  testeurEmail?: string;
  testeurPhoto?: string | null;
  missionTitre: string;
  missionId?: number;
};

export type AdminNotification = {
  id: number;
  titre: string;
  message: string;
  type: string;
  lu: boolean;
  dateCreation?: string;
  destinataireNom?: string;
  destinataireEmail?: string;
};

// ── API Authentification Administrateur Dédiée ───────────────────────
export const adminAuthApi = {
  login: (email: string, password: string) =>
    adminRequest<{ token: string }>("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: (tokenOverride?: string) =>
    adminRequest<User>(
      "/api/me",
      tokenOverride
        ? { headers: { Authorization: `Bearer ${tokenOverride}` } }
        : {}
    ),
};

export const adminApi = {
  stats: () =>
    adminHttp.get<{
      chercheurs: number;
      chercheursActifs: number;
      chercheursSuspendus: number;
      missions: number;
      missionsDisponibles: number;
      missionsEnCours: number;
      missionsSuspendues: number;
      missionsTerminees: number;
      missionsArchivees: number;
      participations: number;
      participationsEnAttente: number;
      participationsEnCours: number;
      participationsTerminees: number;
      participationsRetards: number;
      participationsAbandons: number;
      feedbacks: number;
    }>("/api/admin/stats"),
  users: () => adminHttp.get<User[]>("/api/admin/users"),
  approveUser: (id: number) =>
    adminHttp.patch<{ message: string; statut: string }>(`/api/admin/users/${id}/approve`),
  suspendUser: (id: number) =>
    adminHttp.patch<{ message: string; statut: string }>(`/api/admin/users/${id}/suspend`),
  reactivateUser: (id: number) =>
    adminHttp.patch<{ message: string; statut: string }>(`/api/admin/users/${id}/reactivate`),
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const token = getAdminToken();
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/api/admin/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Échec de l'upload de l'image.");
    }
    return res.json();
  },
  missions: () => adminHttp.get<AdminMission[]>("/api/admin/missions"),
  createMission: (data: MissionPayload) =>
    adminHttp.post<{ message: string; id: number; titre: string }>("/api/admin/missions", data),
  updateMission: (id: number, data: MissionPayload) =>
    adminHttp.put<{ message: string; id: number }>(`/api/admin/missions/${id}`, data),
  changeMissionStatus: (id: number, statut: string) =>
    adminHttp.patch<{ message: string; statut: string }>(`/api/admin/missions/${id}/status`, { statut }),
  deleteMission: (id: number) =>
    adminHttp.delete<{ message: string }>(`/api/admin/missions/${id}`),
  addEtape: (
    missionId: number,
    data: {
      titre: string;
      instruction: string;
      ordre?: number;
      jour?: number;
      besoinReference?: boolean;
      referenceCode?: string;
    }
  ) =>
    adminHttp.post<{ message: string; id: number; titre: string }>(
      `/api/admin/missions/${missionId}/etapes`,
      data
    ),
  participations: () => adminHttp.get<AdminParticipation[]>("/api/admin/participations"),
  acceptParticipation: (id: number) =>
    adminHttp.patch<{ message: string; statut: string }>(`/api/admin/participations/${id}/accept`),
  refuseParticipation: (id: number) =>
    adminHttp.patch<{ message: string; statut: string }>(`/api/admin/participations/${id}/refuse`),
  updateParticipationStatus: (id: number, statut: string) =>
    adminHttp.patch<{ message: string; statut: string }>(`/api/admin/participations/${id}/status`, { statut }),
  participationDetails: (id: number) =>
    adminHttp.get<ParticipationDetail>(`/api/admin/participations/${id}/details`),
  feedbacks: () => adminHttp.get<AdminFeedback[]>("/api/admin/feedbacks"),
  notifications: () => adminHttp.get<AdminNotification[]>("/api/admin/notifications"),
  sendNotification: (data: {
    target: "user" | "mission" | "all";
    targetId?: number;
    titre: string;
    message: string;
    type?: string;
  }) => adminHttp.post<{ message: string; destinataires: number }>("/api/admin/notifications/send", data),
};

export type ApplicationItem = {
  id: number;
  nom: string;
  description?: string;
  logo?: string;
  plateforme: string;
  version: string;
  lienTelechargement?: string;
  developpeurNom?: string;
  developpeurEmail?: string;
  apiKey: string;
  tokenIntegration: string;
  dureeJoursDefaut: number;
  nbMaxPanelistes: number;
  statut: string;
  dateCreation: string;
  dateModification: string;
  nbMissions: number;
  nbPanelistes: number;
};

export type ApplicationPayload = {
  nom: string;
  description?: string;
  logo?: string;
  plateforme?: string;
  version?: string;
  lienTelechargement?: string;
  developpeurNom?: string;
  developpeurEmail?: string;
  dureeJoursDefaut?: number;
  nbMaxPanelistes?: number;
  statut?: string;
};

export type ApplicationDetail = ApplicationItem & {
  missions: Array<{
    id: number;
    titre: string;
    statut: string;
    duree: string;
    remuneration: string;
    participants: number;
  }>;
  panelistes: Array<{
    id: number;
    panelisteUid: string;
    nom: string;
    email?: string;
    missionId: number;
    missionTitre: string;
    progression: number;
    statut: string;
  }>;
};

export type IntegrationInfo = {
  application: {
    id: number;
    nom: string;
    description?: string;
    plateforme: string;
    version: string;
    statut: string;
    dureeJours: number;
    nbMaxPanelistes: number;
  };
  apiKey: string;
  tokenIntegration: string;
  instructions: {
    step1: string;
    step2: string;
    step3: string;
  };
  endpoints: {
    verify: string;
    info: string;
  };
};

export const applicationsApi = {
  list: () => adminHttp.get<ApplicationItem[]>("/api/admin/applications"),
  show: (id: number) => adminHttp.get<ApplicationDetail>(`/api/admin/applications/${id}`),
  create: (data: ApplicationPayload) =>
    adminHttp.post<{ message: string; id: number; apiKey: string; tokenIntegration: string }>(
      "/api/admin/applications",
      data
    ),
  update: (id: number, data: Partial<ApplicationPayload>) =>
    adminHttp.put<{ message: string; id: number }>(`/api/admin/applications/${id}`, data),
  regenerateKey: (id: number) =>
    adminHttp.patch<{ message: string; apiKey: string }>(
      `/api/admin/applications/${id}/regenerate-key`
    ),
  delete: (id: number) =>
    adminHttp.delete<{ message: string }>(`/api/admin/applications/${id}`),
};

export const sdkApi = {
  verifyDay: (data: { apiKey: string; panelisteId: string; code: string }) =>
    api.post<{
      success: boolean;
      alreadyValidated?: boolean;
      message: string;
      jour?: number;
      progression?: number;
      application?: string;
      paneliste?: string;
      error?: string;
    }>("/api/sdk/verify-day", data),
  getIntegrationInfo: (token: string) =>
    api.get<IntegrationInfo>(`/api/public/integration/${token}`),
};


