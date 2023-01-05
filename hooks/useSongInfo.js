import { set } from "lodash";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  songInfoState,
  albumInfoState,
  currentTrackIdState,
  currentSongUriState,
  currentAlbumSongUriState,
  currentAlbumIdState,
  currentAlbumSongIdState,
  currentAlbumUriState,
  likedSongInfoState,
} from "../atoms/songAtom";
import useSpotify from "./useSpotify";

function useSongInfo() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [songInfo, setSongInfo] = useRecoilState(songInfoState);
  const [likedSongInfo, setLikedSongInfo] = useRecoilState(likedSongInfoState);

  const [albumInfo, setAlbumInfo] = useRecoilState(albumInfoState);

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const currentAlbumId = useRecoilValue(currentAlbumIdState);

  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);

  const [currentAlbumSongUri, setCurrentAlbumSongUri] = useRecoilState(
    currentAlbumSongUriState
  );

  const [currentAlbumUri, setCurrentAlbumUri] =
    useRecoilState(currentAlbumUriState);

  const [currentAlbumSongId, setCurrentAlbumSongId] = useRecoilState(
    currentAlbumSongIdState
  );

  const fetchSongInfo = async () => {
    const trackInfo = await fetch(
      `https://api.spotify.com/v1/tracks/${currentTrackId}`,
      {
        headers: {
          //When you make a request to an API endpoint that access token is put inside the header.
          // We can pass around the access token as a bearer with the token.
          Accept: "application/json",
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    ).then((res) => res.json());
    console.log("fetchSongInfo triggered!!!!!!!!!");
    console.log({ trackInfo });
    setSongInfo(trackInfo);
    const trackId = trackInfo?.id;
    console.log({ trackId });
    setCurrentTrackId(trackId);
    const songUri = trackInfo?.uri;
    console.log({ songUri });
    console.log({ currentAlbumSongUri });
    currentAlbumSongUri
      ? setCurrentSongUri(currentAlbumSongUri)
      : setCurrentSongUri(songUri);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentTrackId && currentSongUri) {
      fetchSongInfo();
    }
  }, [currentTrackId, currentSongUri, spotifyApi, session]);

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

    console.log("fetchAlbumInfo triggered!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log({ albumInfo });
    setAlbumInfo(albumInfo);

    const albumSongId = albumInfo?.tracks?.items[0]?.id;
    console.log({ albumSongId });
    setCurrentTrackId(albumSongId);
    setCurrentAlbumSongId(albumSongId);
    const albumSongUri = albumInfo?.tracks?.items[0]?.uri;
    console.log({ albumSongUri });
    setCurrentAlbumSongUri(albumSongUri);
    const albumUri = albumInfo?.uri;
    console.log({ albumUri });
    setCurrentAlbumUri(albumUri);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentAlbumId) {
      fetchAlbumInfo();
    }
  }, [currentAlbumId, spotifyApi, session]);

  const fetchLikedSongInfo = async () => {
    const LikedSongInfo = await fetch(`https://api.spotify.com/v1/me/tracks`, {
      headers: {
        //When you make a request to an API endpoint that access token is put inside the header.
        // We can pass around the access token as a bearer with the token.
        Accept: "application/json",
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    }).then((data) => data.json());

    console.log("fetchLikedSongInfo triggered!!!!!!!!!");
    // console.log( LikedSongInfo.items );
    setLikedSongInfo(LikedSongInfo.items);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      fetchLikedSongInfo();
    }
  }, [spotifyApi, session]);

  return songInfo;
}

export default useSongInfo;
