type AnyRecord = Record<string, unknown>;

declare global {
  var adyapanStore:
    | {
        users: AnyRecord[];
        leads: AnyRecord[];
        payments: AnyRecord[];
        certificates: AnyRecord[];
        otps: AnyRecord[];
      }
    | undefined;
}

export const store =
  global.adyapanStore ??
  (global.adyapanStore = {
    users: [],
    leads: [],
    payments: [],
    certificates: [],
    otps: []
  });

export function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function publicUser(user: AnyRecord) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
