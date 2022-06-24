import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentAlbumIdState,
  currentAlbumSongUriState,
  currentAlbumSongIdState,
  currentTrackIdState,
} from "../atoms/songAtom";
import useSpotify from "./useSpotify";
function useAlbumInfo() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [albumInfo, setAlbumInfo] = useState(null);
  const currentAlbumId = useRecoilValue(currentAlbumIdState);
  const [currentAlbumSongUri, setCurrentAlbumSongUri] = useRecoilState(
    currentAlbumSongUriState
  );
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // const [currentAlbumSongId, setCurrentAlbumSongId] = useRecoilState(
  //   currentAlbumSongIdState
  // );
  const fetchAlbumInfo = async () => {
    const albumInfo = await fetch(
      `https://api.spotify.com/v1/albums/${currentAlbumId}`,
      {
        headers: {
          //When you make a request to an API endpoint that access token is put inside the header.
          // We can pass around the access token as a bearer with the token.
          Accept: "application/json",
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    ).then((res) => res.json());

    console.log("useAlbumInfo triggered!");
    console.log(albumInfo);
    setAlbumInfo(albumInfo);
    const albumSongUri = albumInfo.tracks.items[0].uri;
    const albumSongId = albumInfo.tracks.items[0].id;
    // const albumSongId = albumInfo.tracks.items[0].id;
    setCurrentAlbumSongUri(albumSongUri);
    setCurrentTrackId(albumSongId);
    // setCurrentAlbumSongId(albumSongId);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentAlbumId) {
      fetchAlbumInfo();
    }
  }, [currentAlbumId, spotifyApi, session]);

  console.log({ albumInfo });
  console.log({ currentAlbumId });
  console.log({ currentTrackId });
  // console.log({ currentAlbumSongId });
  console.log({ currentAlbumSongUri });

  return albumInfo;
}

export default useAlbumInfo;
