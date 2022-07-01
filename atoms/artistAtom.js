import { atom } from "recoil";

export const artistIdState = atom({
  key: "artistIdState",
  default: null,
});

export const artistAlbumsState = atom({
  key: "artistAlbumsState",
  default: [],
});

export const artistAlbumIdState = atom({
  key: "artistAlbumIdState",
  default: null,
});
export const artistAlbumTracksState = atom({
  key: "artistAlbumTracksState",
  default: null,
});
export const artistAlbumInfoState = atom({
  key: "artistAlbumInfoState",
  default: [],
});

export const singleArtistState = atom({
  key: "singleArtistState",
  default: [],
});

export const artistTopTracksState = atom({
  key: "artistTopTracksState",
  default: [],
});
export const artistsRelatedToArtistState = atom({
  key: "artistsRelatedToArtistState",
  default: [],
});
