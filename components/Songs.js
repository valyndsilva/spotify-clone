import React from "react";
import Song from "./Song";

function Songs({ tracks }) {
  return (
    <div className="text-white px-8 flex-col space-y-1 pb-28">
      {tracks.map((track, index) => (
        <Song
          key={track.track.id}
          order={index}
          trackId={track.track.id}
          track={track}
          trackUri={track.track.uri}
          trackImg={track.track.album.images[0].url}
          trackName={track.track.name}
          artistName={track.track.artists[0].name}
          albumName={track.track.album.name}
          duration={track.track.duration_ms}
        />
      ))}
    </div>
  );
}

export default Songs;
