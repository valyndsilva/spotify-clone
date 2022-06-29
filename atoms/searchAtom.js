import { atom } from "recoil";
export const newReleasesState = atom({
  key: "newReleasesState",
  default: [],
});

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const searchResultsState = atom({
  key: "searchResultsState",
  default: "",
});
