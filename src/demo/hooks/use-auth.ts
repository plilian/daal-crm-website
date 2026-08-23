import { useQuery } from "@tanstack/react-query";
import type { PublicUser, Role } from "@/demo/server/types";
import { getMe } from "@/demo/server/functions";

export type { Role };

export const ROLE_LABELS: Record<Role, string> = {
  admin: "مدیر سامانه",
  manager: "مدیر فروش",
  reception: "عملیات",
  practitioner: "کارشناس اجرا",
  marketing: "بازاریابی",
  agent: "کارشناس فروش",
};

export const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as Role[]).map((value) => ({
  value,
  label: ROLE_LABELS[value],
}));

export function useAuth() {
  const { data: user = null, isLoading: checking } = useQuery<PublicUser | null>({
    queryKey: ["demo-me"],
    queryFn: getMe,
    retry: false,
  });

  const roles: Role[] = user ? [user.role] : [];
  const isDemo = user?.id === "00000000-0000-0000-0000-000000000001";

  return {
    user,
    roles,
    loading: checking,
    isDemo,
    has: (...allowed: Role[]) => allowed.some((r) => roles.includes(r)),
    isAdmin: roles.includes("admin"),
  };
}
