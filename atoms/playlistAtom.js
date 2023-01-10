import { atom } from "recoil";
export const playlistState = atom({
  key: "playlistState",
  default: [],
});
export const userPlaylistState = atom({
  key: "userPlaylistState",
  default: [],
});
export const playlistSongsState = atom({
  key: "playlistSongsState",
  default: [],
});
export const newReleasesPlaylistSongsState = atom({
  key: "newReleasesPlaylistSongsState",
  default: [],
});

export const recentlyPlayedSongsState = atom({
  key: "recentlyPlayedSongsState",
  default: [],
});
export const recentlyPlayedState = atom({
  key: "recentlyPlayedState",
  default: [],
});

export const playlistIdState = atom({
  key: "playlistIdState",
  default: "37i9dQZF1DXclbYmv5Uve0",
  // default: null,
});

export const currentPlaylistIdState = atom({
  key: "currentPlaylistIdState", //unique ID(with respect to other atom/selectors)
  default: null, // default value (initial value)
});
