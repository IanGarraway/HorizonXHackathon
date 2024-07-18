import { useState } from "react";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-red-500 border-b-2 mb-7 drop-shadow-md">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="text-lg font-poppins">LightHouse</span>
            {/* <img
              alt=""
              src="https://static.wixstatic.com/media/e66cd2_bfdfbe594a324d1baacd3e98f55cfb82~mv2.png/v1/fill/w_221,h_78,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/e66cd2_bfdfbe594a324d1baacd3e98f55cfb82~mv2.png"
              className="h-8 w-auto"
            /> */}
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <NavLink
            to="/"
            className="font-poppins text-sm leading-6 text-gray-900"
          >
            LLM List
          </NavLink>
          <NavLink
            to="#"
            className="font-poppins text-sm leading-6 text-gray-900"
          >
            Matrix
          </NavLink>
          <NavLink
            to="#"
            className="font-poppins text-sm leading-6 text-gray-900"
          >
            About
          </NavLink>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="font-poppins text-sm leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://static.wixstatic.com/media/e66cd2_bfdfbe594a324d1baacd3e98f55cfb82~mv2.png/v1/fill/w_221,h_78,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/e66cd2_bfdfbe594a324d1baacd3e98f55cfb82~mv2.png"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <NavLink
                  to="/"
                  className="font-poppins -mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                >
                  LLM List
                </NavLink>
                <NavLink
                  to="#"
                  className="font-poppins -mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Matrix
                </NavLink>
                <NavLink
                  to="#"
                  className="font-poppins -mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                >
                  About
                </NavLink>
              </div>
              {/* <div className="py-6">
                <a
                  href="#"
                  className="font-poppins -mx-3 block rounded-lg px-3 py-2.5 text-base leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div> */}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
