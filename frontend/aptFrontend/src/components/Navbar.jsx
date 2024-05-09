import { Fragment, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import useSession from "../hooks/auth/useSession";
import { useMutation } from "react-query";
import { postRequest } from "../API/API";


export default function Navbar() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate()
  const { status } = useSession()
  const postReq = useMutation((data) => postRequest('/backend/user/logout', data));
  return (
    <header className="bg-white h-[var(--navbar-height)]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 h-[var(--navbar-height)]"
        aria-label="Global"
      >
        <div className="flex gap-2 lg:flex-1">
          <ArticleIcon color="primary" />
          Google Docx
        </div>
        <div className="flex">
        </div>
        <div className=" flex justify-end">
          {status === 'authenticated' ? (
            <button onClick={() => {
              postReq.mutate({})
              localStorage.clear()
              navigate('/')
            }} className=" cursor-pointer text-sm font-semibold leading-6 text-gray-900">
              Log Out
            </button>) : (<button onClick={() => {
              navigate('/')
            }} className=" cursor-pointer text-sm font-semibold leading-6 text-gray-900">
              Log in
            </button>)}
        </div>
      </nav>
      {/* <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      > */}

    </header>
  );
}
