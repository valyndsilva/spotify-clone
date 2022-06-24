import React from "react";
import { useRecoilState } from "recoil";
import { newReleasesPlaylistSongsState } from "../atoms/playlistAtom";
import Track from "./Track";

function Tracks({ tracks }) {
  console.log({ tracks });

  const [newReleasesPlaylistSongs, setNewReleasesPlaylistSongs] =
    useRecoilState(newReleasesPlaylistSongsState);
  setNewReleasesPlaylistSongs(tracks);
  console.log({ newReleasesPlaylistSongs });

  return (
    <div className="text-white px-8 flex-col space-y-1 pb-28">
      {newReleasesPlaylistSongs?.map((track, index) => (
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
