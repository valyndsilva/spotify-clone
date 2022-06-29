import Head from "next/head";
import { Sidebar, Liked ,Player} from "../../components";

const Tracks = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Liked />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default Tracks;
