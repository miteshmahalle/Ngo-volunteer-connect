const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export type RegisterPayload = {
  role: "ngo" | "volunteer";
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  state?: string;
  registration_number?: string;
  focus_areas?: string[];
  skills?: string[];
  aadhaar_number?: string;
};

export type OpportunityPayload = {
  title: string;
  description: string;
  city: string;
  state: string;
  focus_area: string;
  start_date: string;
  end_date?: string;
  required_volunteers: number;
};

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  city?: string;
  state?: string;
  registration_number?: string;
  focus_areas?: string[];
  website?: string;
  skills?: string[];
  aadhaar_number?: string;
  availability?: string;
  interests?: string[];
};
export async function registerUser(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail ?? "Registration failed");
  }
  return response.json();
}

export async function loginUser(payload: { email: string; password: string; role: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail ?? "Login failed");
  }
  return response.json();
}

export async function createOpportunity(payload: OpportunityPayload) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/opportunities/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail ?? "Post creation failed");
  }

  return response.json();
}
export async function getOpportunities() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/opportunities/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail ?? "Failed to load opportunities");
  }

  return response.json();
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail ?? "Profile update failed");
  }

  return response.json();
}

export async function getMe() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail ?? "Failed to load profile");
  }

  return response.json();
}

export async function getReceivedApplications() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/opportunities/applications/received/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail ?? "Failed to load applications");
  }

  return response.json();
}

export async function changePassword(payload: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error((await response.json()).detail || "Failed");
  }

  return response.json();
}