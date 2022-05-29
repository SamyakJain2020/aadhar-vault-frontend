/* eslint-disable jsx-a11y/anchor-is-valid */
import { Popover } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "./assets/logo.png";
export default function Example() {
  return (
    <header>
      <div className="relative bg-black">
        <div className="flex justify-between items-center max-w-full mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
          <div className="flex justify-start ">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                className="h-auto w-8 md:w-10 "
                src={logo}
                alt=""
              />
            </a>
          </div>
          {/* <div className="-mr-12 -my-2 md:hidden">
            <Popover.Button className="bg-black rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div> */}
          <div as="nav" className=" md:flex space-x-10 sm:flex-wrap">
            <a
              href="/"
              className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
            >
              HOME
            </a>
            <a
              href="/home"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              Self Sovereign Identity
            </a>
            <a
              href="/sign"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              Sign Document
            </a>
            <a
              href="/my-docs"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              My Verified Documenets
            </a>
             <a
              href="/verify"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              Verify Document
            </a>
          </div>
          <div className="l md:flex items-center justify-end md:flex-1 lg:w-0 sm:flex-wrap">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
