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

export const searchTrackResultsState = atom({
  key: "searchTrackResultsState",
  default: "",
});

export const searchArtistResultsState = atom({
  key: "searchArtistResultsState",
  default: "",
});

export const topArtistResultsState = atom({
  key: "topArtistResultsState",
  default: [],
});
export const featuredPlaylistsResultsState = atom({
  key: "featuredPlaylistsResultsState",
  default: [],
});

export const searchPlaylistResultsState = atom({
  key: "searchPlaylistResultsState",
  default: "",
});
