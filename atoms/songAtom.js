import {atom} from "recoil";

export const currentTrackIdState=atom({
    key:"currentTrackIdState", //unique ID(with respect to other atom/selectors)
    default:null // default value (initial value)
});

export const isPlayingState = atom({
    key:"isPlayingState",
    default:false,
})