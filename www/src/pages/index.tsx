import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import LandingPage from "./components/LandingPage";
import NavBar from "./components/NavBar";
import Blogs from "./components/Blogs";
import FeatureSlider from './components/FeatureSlider'
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>

      <NavBar />

      <LandingPage />
      {/* <FeatureSlider/> */}
      {/* <Blogs /> */}
    </>
  );
};

export default Home;
