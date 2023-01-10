import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { volumeState } from "../atoms/playerAtom";
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
  currentSongAlbumUriState,
  isPlayingState,
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

  const [currentSongUri, setCurrentSongUri] =
    useRecoilState(currentSongUriState);

  const [currentSongAlbumUri, setCurrentSongAlbumUri] = useRecoilState(
    currentSongAlbumUriState
  );

  const [currentAlbumId, setCurrentAlbumId] =
    useRecoilState(currentAlbumIdState);

  const [currentAlbumUri, setCurrentAlbumUri] =
    useRecoilState(currentAlbumUriState);

  const [currentAlbumSongId, setCurrentAlbumSongId] = useRecoilState(
    currentAlbumSongIdState
  );
  const [volume, setVolume] = useRecoilState(volumeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  // Fetch Current Song Track Playing In Player:
  const fetchCurrentSong = async () => {
    if (!currentTrackId && !currentSongUri) {
      // console.log("fetchCurrentSong Triggered!!");

      // Get the User's Currently Playing Track
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now Playing:", data.body);
        setSongInfo(data.body);
        const trackId = data.body?.item?.id;
        // console.log(trackId);
        setCurrentTrackId(trackId);
        const songUri = data.body?.item?.uri;
        // console.log({ songUri });
        setCurrentSongUri(songUri);

        // Get Information About The User's Current Playback State
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId && !currentSongUri) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, currentSongUri, spotifyApi, session]);

  // Fetch Track based on currentTrackId if a Track is selected.
  const fetchSongInfo = async () => {
    // console.log("fetchSongInfo Triggered!!");
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
    // console.log({ trackInfo });
    // setSongInfo(trackInfo);
    const trackId = trackInfo?.id;
    // console.log({ trackId });
    setCurrentTrackId(trackId);
    const songUri = trackInfo?.uri;
    // console.log({ songUri });
    setCurrentSongUri(songUri);
    const albumUri = trackInfo?.album.uri;
    // console.log({ albumUri });
    setCurrentSongAlbumUri(albumUri);
    const albumId = trackInfo?.album.id;
    // console.log({ albumId });
    setCurrentAlbumId(albumId);
    // fetchAlbumInfo();
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentTrackId && currentSongUri) {
      fetchSongInfo();
    }
  }, [currentTrackId, currentSongUri, spotifyApi, session]);

  // const fetchAlbumInfo = async () => {
  //   const albumInfo = await fetch(
  //     `https://api.spotify.com/v1/albums/${currentAlbumId}`,
  //     {
  //       headers: {
  //         //When you make a request to an API endpoint that access token is put inside the header.
  //         // We can pass around the access token as a bearer with the token.
  //         Accept: "application/json",
  //         Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
  //       },
  //     }
  //   ).then((res) => res.json());

  //   // console.log("fetchAlbumInfo triggered!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  //   // console.log({ albumInfo });
  //   setAlbumInfo(albumInfo);

  //   const albumSongId = albumInfo?.tracks?.items[0]?.id;
  //   // console.log({ albumSongId });
  //   setCurrentTrackId(albumSongId);
  //   setCurrentAlbumSongId(albumSongId);
  //   const albumSongUri = albumInfo?.tracks?.items[0]?.uri;
  //   // console.log({ albumSongUri });
  //   setCurrentSongAlbumUri(albumSongUri);
  //   const albumUri = albumInfo?.uri;
  //   // console.log({ albumUri });
  //   setCurrentAlbumUri(albumUri);
  // };

  // useEffect(() => {
  //   if (spotifyApi.getAccessToken() && currentAlbumId) {
  //     fetchAlbumInfo();
  //   }
  // }, [currentAlbumId, spotifyApi, session]);

  const fetchLikedSongInfo = async () => {
    const LikedSongInfo = await fetch(`https://api.spotify.com/v1/me/tracks`, {
      headers: {
        //When you make a request to an API endpoint that access token is put inside the header.
        // We can pass around the access token as a bearer with the token.
        Accept: "application/json",
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    }).then((data) => data.json());

    // console.log("fetchLikedSongInfo triggered!!!!!!!!!");
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
