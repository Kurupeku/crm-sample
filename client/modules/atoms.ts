import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const themeTypeState = atom<"light" | "dark">({
  key: "themeType",
  default: "light",
  effects_UNSTABLE: [persistAtom],
});

export const globalLoadingState = atom<boolean>({
  key: "globalLoading",
  default: true,
  effects_UNSTABLE: [persistAtom],
});

interface Session {
  email: string;
  expire: number;
}

export const sessionState = atom<Session | null>({
  key: "sessionEmail",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

interface Staff {
  id: String;
  name: String;
  email: String;
  icon: String;
}

export const currentStaffState = atom<Staff | null>({
  key: "sessionStaff",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
