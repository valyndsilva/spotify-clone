import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState", //unique ID(with respect to other atom/selectors)
  default: null, // default value (initial value)
});

export const currentAlbumIdState = atom({
  key: "currentAlbumIdState", //unique ID(with respect to other atom/selectors)
  default: null, // default value (initial value)
});

export const currentAlbumSongIdState = atom({
  key: "currentAlbumSongIdState", //unique ID(with respect to other atom/selectors)
  default: [], // default value (initial value)
});

export const currentAlbumSongUriState = atom({
  key: "currentAlbumSongUriState", //unique ID(with respect to other atom/selectors)
  default: null, // default value (initial value)
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});
