export interface UserDetails {
  name: string | null;
  username: string;
  user_id: string;
  plan: 'BASE' | 'PRO' | 'SUPER';
  email: string | null;
  profile: string;
}
