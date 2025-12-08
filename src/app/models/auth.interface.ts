/**
 * Interfaces para el sistema de autenticación y permisos
 */

export interface Permission {
  id: number;
  key: string;
  name: string;
}

export interface Module {
  id: number;
  key: string;
  name: string;
  permissions: Permission[];
  children?: Module[];
}

export interface UserData {
  user_id: string;
  username: string;
  status: boolean;
  id: string;
  profile_id: string;
  first_name: string;
  email: string;
  last_name: string;
  gender: string;
  local_number: string;
  phone_number: string;
  avatar_url: string;
  permissions: Module[];
}

export interface LoginResponse {
  id: string;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  data: {
    user: UserSession;
  };
}

export interface SessionData {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

export interface PermissionDetail {
  id: number;
  key: string;
  name: string;
}

export interface PermissionNode {
  id: number;
  key: string;
  name: string;
  permissions: PermissionDetail[];
  children?: PermissionNode[];
}

export interface UserSession extends SessionData {
  user_id: string;
  username: string;
  status: boolean;
  id: string;
  profile_id: string | null;
  first_name: string;
  email: string;
  last_name: string;
  gender: string | null;
  local_number: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  permissions: PermissionNode[];
}

export interface VerifyResponse {
  id: string;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  data: {
    session: UserSession  ;
  };
}
