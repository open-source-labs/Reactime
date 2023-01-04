/**
 * create an input box
 * create a password andusername checker --
 *  if correct send them the shit
 */

import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LandingPage from "./components/LandingPage";
import NavBar from "./components/NavBar";
import Blogs from "./components/Blogs";
import { trpc } from "../utils/trpc";

const secret: NextPage = () => {

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("")

  const clickHandler = (e:any) => {
    if (process.env.NEXT_PUBLIC_ADMIN_PASSWORD === password) {
      setIsAdmin(true);
    }
  };

  return (
    <>
      {!isAdmin && <div className = 'flex h-screen items-center justify-center'>
        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          placeholder="password"
          className="block w-50 rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500 mr-8">
        </input>
        <button onClick={e => clickHandler(e)} className="blockrounded-md border rounded border-transparent bg-rose-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10">Submit</button>
      </div>}
        {isAdmin && <div>You logged in!</div>}

    </>
  );
};

export default secret;
