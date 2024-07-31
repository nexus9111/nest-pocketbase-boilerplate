import { UserRole } from '../../../shared/users.role';

export interface DBUser {
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  updated: string;
  username: string;
  verified: boolean;
  role: UserRole;
}

export interface User {
  id: string;
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  role: UserRole;
}

const anonymiseEmail = (email: string) => {
  if (!email) return '';
  const beforeAt = email.split('@')[0];
  const afterAt = email.split('@')[1];
  const firstChar = beforeAt.charAt(0);
  const lastChar = beforeAt.charAt(beforeAt.length - 1);
  return `${firstChar}*****${lastChar}@${afterAt}`;
};

export const UserAdapter = (user: DBUser, forceShowEmail = false): User => {
  return {
    id: user.id,
    username: user.username,
    email:
      user.emailVisibility || forceShowEmail
        ? user.email
        : anonymiseEmail(user.email),
    emailVisibility: user.emailVisibility,
    verified: user.verified,
    role: user.role,
  };
};

export const UsersAdapter = (users: DBUser[]): User[] => {
  return users.map((user) => UserAdapter(user));
};

/* -------------------------------------------------------------------------- */

export interface DBAuthUser {
  token: string;
  record: DBUser;
}
export interface AuthUser {
  token: string;
  user: User;
}

export const AuthAdapter = (authUser: DBAuthUser): AuthUser => {
  return {
    token: authUser.token,
    user: UserAdapter(authUser.record, true),
  };
};
