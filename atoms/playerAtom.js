import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const playState = atom({
  key: "playState",
  default: false,
});
export const playerSongState = atom({
  key: "playerSongState",
  default: false,
});

export const playingTrackState = atom({
  key: "playingTrackState",
  default: "",
});

export const deviceIdState = atom({
  key: "deviceIdState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const isDeviceActiveState = atom({
  key: "isDeviceActiveState",
  default: false,
});

export const volumeState = atom({
  key: "volumeState",
  default: 50,
  effects_UNSTABLE: [persistAtom],
});

export const durationMsState = atom({
  key: "durationMsState",
  default: false,
});

export const progressMsState = atom({
  key: "progressMsState",
  default: false,
});

export const currentDurationMinState = atom({
  key: "currentDurationMinState",
  default: false,
});


export const totalDurationMinState = atom({
  key: "totalDurationMinState",
  default: false,
});

export const currentProgressWidthState = atom({
  key: "currentProgressWidthState",
  default: false,
});