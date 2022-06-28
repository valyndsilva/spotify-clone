import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const playState = atom({
  key: "playState",
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

// export const volumeState = atom({
//   key: "volumeState",
//   default: 50,
//   effects_UNSTABLE: [persistAtom],
// });
