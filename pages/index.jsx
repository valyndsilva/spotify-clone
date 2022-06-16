import Head from "next/head";
import { getSession } from "next-auth/react";
import { Sidebar, MainView, Player } from "../components";
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
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

//Pre-render user on the server side which gives accessToken before it hits the client side so we have the key.
export async function getServerSideProps(context) {
  const session = await getSession(context); // prefetches session info so it can use the info before hand. Ex: render the playlist image in MainView.js
  return {
    props: {
      session,
    },
  };
}
export default Home;
