export interface AuthResponseData {
  code: number;
  expire: string;
  token: string;
}

export interface Payload {
  email: string;
  exp: number;
  orig_iat: number;
}

export const decodeJwt = (token: string): Payload | null => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
  if (payload.email && payload.exp && payload.orig_iat) return payload;

  return null;
};

export const generateSessionData = (
  data: AuthResponseData
): { email: string; expire: number } => {
  const { token, expire } = data;
  const decodedToken = decodeJwt(token) as Payload;
  return { email: decodedToken.email, expire: Date.parse(expire) };
};
