/**
 * create an input box
 * create a password andusername checker --
 *  if correct send them the shit
 */

import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import LandingPage from "./components/LandingPage";
import NavBar from "./components/NavBar";
import Blogs from "./components/Blogs";
import { trpc } from "../utils/trpc";

const secret: NextPage = () => {
  return (
    <>
      <div className = 'flex h-screen items-center justify-center'>
        <input
          type="password"
          required
          placeholder="password"
          className="block w-50 rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500 mr-8">
        </input>
        <button className="blockrounded-md border rounded border-transparent bg-rose-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10">Submit</button>
      </div>
    </>
  );
};

export default secret;
