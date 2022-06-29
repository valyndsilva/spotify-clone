import React from "react";
import Result from "./Result";

function Results({ tracks }) {
  console.log({ tracks });

  return (
    <>
      {tracks?.map((track, index) => (
        <Result key={track.id} track={track} />
      ))}
    </>
  );
}

export default Results;
