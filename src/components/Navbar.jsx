/* eslint-disable jsx-a11y/anchor-is-valid */
import { Popover } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "./assets/logo.png";
export default function Example() {
  return (
    <header>
      <Popover className="relative bg-black">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
          <div className="flex justify-start ">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                className="h-8 w-auto sm:h-10"
                src={logo}
                alt=""
              />
            </a>
          </div>
          <div className="-mr-12 -my-2 md:hidden">
            <Popover.Button className="bg-black rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden md:flex space-x-10">
            <a
              href="/"
              className="text-base font-medium text-white hover:text-indigo-900"
            >
              HOME
            </a>
            <a
              href="/home"
              className="text-base font-medium text-white hover:text-indigo-900"
            >
              Self Sovereign Identity
            </a>
            <a
              href="/sign"
              className="text-base font-medium text-white hover:text-indigo-900"
            >
              Sign Document
            </a>
            <a
              href="/my-docs"
              className="text-base font-medium text-white hover:text-indigo-900"
            >
              My Verified Documents
            </a>
          </Popover.Group>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <ConnectButton />
          </div>
        </div>
      </Popover>
    </header>
  );
}
