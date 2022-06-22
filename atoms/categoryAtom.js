import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();
export const categoriesState = atom({
  key: "categoriesState",
  default: [],
  // effects_UNSTABLE: [persistAtom],
});

export const categoryIdState = atom({
  key: "categoryIdState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const categoryNameState = atom({
  key: "categoryNameState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const categoryPlaylistsState = atom({
  key: "categoryPlaylistsState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const categoryPlaylistIdState = atom({
  key: "categoryPlaylistIdState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
