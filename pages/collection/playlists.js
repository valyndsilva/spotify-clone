import Head from "next/head";
import { Sidebar, Search } from "../../components";

const Playlists = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Search />
      </main>
    </div>
  );
};

export default Playlists;
