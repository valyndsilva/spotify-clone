import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playingTrackState } from "../atoms/playerAtom";
import {
  currentAlbumSongIdState,
  currentAlbumSongUriState,
} from "../atoms/songAtom";

import Track from "./Track";

function Tracks({ tracks }) {
  // console.log({ tracks });

  return (
    <div className="text-white px-8 flex-col space-y-1 pb-28">
      {tracks?.map((track, index) => (
        <Track
          key={track.id}
          order={index}
          track={track}
          albumId={track.id}
          albumUri={track.uri}
          albumImg={track.albumUrl}
          albumName={track.title}
          artistName={track.artist}
        />
      ))}
    </div>
  );
}

export default Tracks;
