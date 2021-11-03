import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import {
  GetStaffbyEmailQuery,
  GetStaffbyEmailQueryResult,
  GetStaffByIdQueryResult,
  GetStaffsQuery,
  GetStaffsQueryResult,
  Staff,
} from "../graphql/client";

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

export const currentStaffState = atom<
  GetStaffbyEmailQuery["staffByEmail"] | null
>({
  key: "sessionStaff",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const staffsState = atom<GetStaffsQuery["staffs"]>({
  key: "staffs",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
