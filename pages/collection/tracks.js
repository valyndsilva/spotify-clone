import Head from "next/head";
import { Sidebar, Home } from "../../components";

const Tracks = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Home />
      </main>
    </div>
  );
};

export default Tracks;
