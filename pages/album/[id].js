import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useRecoilState } from "recoil";
import useSpotify from "../../hooks/useSpotify";
import { Sidebar, DropDown, Player, AlbumTracks } from "../../components";
import { useRouter } from "next/router";
import {
  artistAlbumIdState,
  artistAlbumInfoState,
  artistAlbumsState,
  artistAlbumTracksState,
} from "../../atoms/artistAtom";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function Album() {
  // get (query string) parameters from the URL in Next.js:
  const router = useRouter();
  // console.log("artist albumId:",router.query.id);
  const [artistAlbumId, setArtistAlbumId] = useRecoilState(artistAlbumIdState);
  setArtistAlbumId(router.query.id);

  const [artistAlbumInfo, setArtistAlbumInfo] =
    useRecoilState(artistAlbumInfoState);
  const [artistAlbumTracks, setArtistAlbumTracks] = useRecoilState(
    artistAlbumTracksState
  );

  // console.log({ artistId });
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [color, setColor] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop()); //shuffles the colors array and pops a color
  }, [artistAlbumId]);

  const fetchAlbumInfo = () => {
    // Get album
    spotifyApi
      .getAlbum(artistAlbumId)
      .then((data) => {
        console.log("Album information", data.body);
        setArtistAlbumInfo(
          [data.body].map((album) => ({
            albumId: album.id,
            name: album.name,
            total: album.tracks.total,
            imageUrl: album.images?.[0].url,
            artist: album.artists?.[0].name,
            artistId: album.artists?.[0].id,
            uri: album.uri,
            tracks: album.tracks,
          }))
        );
        console.log({ artistAlbumInfo });
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });
  };
  // const fetchTracksInAlbums = () => {
  //   // Get tracks in an album
  //   // "41MnTivkwTO3UUJ8DrqEJJ"
  //   // "4KjbNbnTnJ97kZgQkOHr6v"
  //   spotifyApi
  //     .getAlbumTracks(artistAlbumId, { limit: 5, offset: 1 })
  //     .then((data) => {
  //       console.log("Tracks In Artist Album", data.body.items);
  //       setArtistAlbumTracks(
  //         data.body.items.map((track) => {
  //           return {
  //             id: track.id,
  //             title: track.name,
  //             artist: track.artists?.[0].name,
  //             duration: track.duration_ms,
  //             uri: track.uri,
  //           };
  //         })
  //       );
  //     })
  //     .catch((err) => {
  //       console.log("Something went wrong!", err);
  //     });
  // };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && artistAlbumId) {
      fetchAlbumInfo();
      // fetchTracksInAlbums();
    }
  }, [artistAlbumId, spotifyApi, session]);
  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="flex text-white ">
        <Sidebar />
        <main className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
          <header className="absolute top-5 right-8">
            <DropDown className="absolute top-5 right-8" />
          </header>
          {artistAlbumInfo.map((album) => (
            <>
              <section
                key={album.albumId}
                className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
              >
                <div className="w-44 h-44 shadow-2xl rounded cursor-pointer relative">
                  <img src={album.imageUrl} alt={album.name} />
                </div>
                <div>
                  <p>album</p>
                  <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                    {album.name}
                  </h1>
                  <p>{album.total} songs</p>
                </div>
              </section>
              <div>
                {album.tracks &&
                  album.tracks.items.map((track, index) => {
                    <AlbumTracks
                      track={track}
                      order={index}
                      albumUrl={album.imageUrl}
                    />;
                  })}
              </div>
            </>
          ))}
        </main>
      </div>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Album;
{
  /* <>
            
              <div>
                {album.tracks &&
                  album.tracks.items.map((track, index) => {
                    <AlbumTracks
                      track={track}
                      order={index}
                      albumUrl={album.imageUrl}
                    />;
                  })}
              </div>
            </>; */
}
