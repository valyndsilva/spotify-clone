import Head from "next/head";
import Image from "next/image";
import { Sidebar, MainView } from "../components";
const Home = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <MainView />
      </main>
      <div>{/* Player */}</div>
    </div>
  );
};

export default Home;
