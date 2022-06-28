import { atom } from "recoil";
export const playlistState = atom({
  key: "playlistState",
  default: null,
});
export const playlistSongsState = atom({
  key: "playlistSongsState",
  default: [],
});
export const newReleasesPlaylistSongsState = atom({
  key: "newReleasesPlaylistSongsState",
  default: [],
});
export const playlistIdState = atom({
  key: "playlistIdState",
  default: "37i9dQZF1DXcBWIGoYBM5M",
});

export const currentPlaylistIdState = atom({
  key: "currentPlaylistIdState", //unique ID(with respect to other atom/selectors)
  default: null, // default value (initial value)
});
