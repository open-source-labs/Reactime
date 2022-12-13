import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}



export default function NavBar() {

const [scrollPosition, setScrollPosition] = useState(0);

const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
};

useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}, []);

function NavBarSytling() {
  return scrollPosition === 0 ? "sticky top-0 bg-gray-50 w-screen z-20 border-b" : "sticky top-0 bg-gray-50 w-screen z-20 shadow-xl";
}


  return (
    <Disclosure as="nav" className={NavBarSytling()}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w9xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 mx-6 items-center justify-between">
              <div className="flex items-center">
                <div className="ml-6 flex-shrink-0">
                  <img
                    className="block h-9 w-auto lg:hidden"
                    src="https://i.imgur.com/ELBAyVb.png"
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-9 w-auto lg:block"
                    src="https://i.imgur.com/ELBAyVb.png"
                    alt="Your Company"
                  />
                </div>
                <h2 className="font-bold text-2xl pl-1 mt-2">Reactime</h2>
                <span className="inline-flex items-center mt-2 mx-4 rounded-full bg-red-200 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  v17.0.0
                </span>
                
            </div>

            <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                    <a
                      href="http://github.com/open-source-labs/reactime"
                      target="_blank"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-700 hover:text-white"
                    >
                      Github
                    </a>
                    <a 
                    href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga?hl=en-US"
                    target="_blank"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white">
                      Download
                    </a>
                  </div>
                </div>
              </div>  
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
             
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Team
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Projects
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Calendar
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              >
                Download
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

import React from 'react';