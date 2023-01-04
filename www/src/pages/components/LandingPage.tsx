import { ChevronRightIcon, StarIcon } from '@heroicons/react/20/solid';
import { string } from 'prop-types';
import TeamSection from '../components/TeamSection';
import FeaturesSection from '../components/FeaturesSection';
import Image from 'next/image';
import Blogs from './Blogs';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

export default function LandingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { mutate } = trpc.user.createUser.useMutation();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // grab the information of name and email
    // bundle those together to be an object to be sent to backend
    mutate({name, email});
    setName('');
    setEmail('');
  }

  return (
    <>
    <div className="bg-gray-50">
      <main>
        {/* Hero section */}
        <div className="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-48">
          <div className="mx-32 max-w-md px-4 sm:max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div>
              <div>
                <img
                  className="pl-60 h-20 w-auto"
                  src="https://i.imgur.com/ELBAyVb.png"
                  alt="Reactime"
                />
              </div>
              <div className="mt-20">
                <div>
                  <a href="#" className="inline-flex space-x-4">
                    <span className="rounded bg-rose-50 px-2.5 py-1 text-sm font-semibold text-rose-500">
                      What's new
                    </span>
                    <span className="inline-flex items-center space-x-1 text-sm font-medium text-rose-500">
                      <span>Just shipped version 17.0.0</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </a>
                </div>
                <div className="mt-6 sm:max-w-xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    A time travel debugger for modern react apps
                  </h1>
                  <p className="mt-6 text-xl text-gray-500">
                    A Chrome Extension that lets you rewind time and replay previous versions of your stateful React components.
                  </p>
                </div>
                <form action="#" className="mt-12 sm:flex sm:w-full sm:max-w-lg">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="block w-full rounded-md border border-gray-300 px-5 mb-2 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      placeholder="Enter your name"
                      required
                      value = {name}
                      onChange ={(e) => {setName(e.target.value)}}
                    />
                    <label htmlFor="hero-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="hero-email"
                      type="email"
                      className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      placeholder="Enter your email"
                      required
                      value = {email}
                      onChange = {(e) => {setEmail(e.target.value)}}
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent bg-rose-500 mt-8 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                      onClick={(e)=> handleSubmit(e)}
                    >
                      Notify me
                    </button>
                  </div>
                </form>
                <div className="mt-6">
                  <div className="inline-flex items-center">
                    <div className="flex flex-shrink-0">
                      {/* <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" /> */}
                    </div>
                    <div className="min-w-0 inline py-1 text-sm text-gray-500 sm:py-3">
                    <StarIcon className="h-5 w-5 mb-1 mr-2 text-yellow-400 inline" aria-hidden="true" />
                      <span className="font-medium text-gray-900"> Starred on GitHub</span> by over{' '}
                      <span className="font-medium text-rose-500">1,700 users</span>
                      <StarIcon className="h-5 w-5 ml-2 mb-1 text-yellow-400 inline" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="hidden sm:block">
                <div className="absolute inset-y-0 left-1/2 w-screen rounded-l-3xl bg-gray-50 lg:left-80 lg:right-0 lg:w-full" />
                <svg
                  className="absolute top-8 right-1/2 -mr-3 lg:left-0 lg:m-0"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  <defs>
                    <pattern
                      id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width={404} height={392} fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
                </svg>
              </div>
              <div className="relative -mr-40 pl-4 sm:mx-auto sm:max-w-3xl sm:px-0 lg:h-full lg:max-w-none lg:pl-12">
                <img
                  className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  src="/RTScreen.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

      <div className="relative mt-16">
        <Blogs />
        <FeaturesSection />
        <TeamSection />
      </div>
    </main>
      {/* Footer section */}
      <footer className="mt-8 bg-[#333333] gray-900 sm:mt-8">
        <div className="mx-auto max-w-md overflow-hidden py-3 pb-10 px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2022 Reactime, All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  </>
  )
}
