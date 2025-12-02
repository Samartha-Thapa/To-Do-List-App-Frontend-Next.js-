"use client";
import { useSession, signOut } from "next-auth/react";
import { MdDashboard } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { IoCloseCircleSharp, IoSettings, } from "react-icons/io5";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";
import React, { useState } from 'react'
import Link from "next/link";
import Cookies from "js-cookie";
import { IoMenu } from "react-icons/io5";

const SideBar = () => {
    const {data:session} = useSession();
    const [isOpen, setIsOpen] = useState(false)


    return (
    <>
    <div className="flex">
        <button
            onClick={() => {
                setIsOpen(true)
            }}
            className="lg:hidden w-full p-3 hover:bg-gray-400 bg-gray-300 shadow rounded cursor-pointer flex items-center justify-center">
                <div
                className="text-4xl text-gray-800 px-2 text-center flex items-center justify-center"
                >
                    <IoMenu />
                </div>
            <span className="text-3xl text-center">Menu</span>
        </button>
    </div>
    <div className="flex">
      <aside
            aria-label="Sidebar"
            id="default-sidebar"
            className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r-2 border-slate-200 
                        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
            <div className='w-64 px-4 py-9'>
                <ul className="space-y-6 font-medium">
                    <li>
                        <Link href="/dashboard" className='flex items-center p-2 text-2xl rounded-lg hover:bg-gray-200 transition-colors'>
                            <MdDashboard/> 
                            <span className="ms-3">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/tasks" className='flex items-center p-2 text-2xl rounded-lg hover:bg-gray-200 transition-colors'>
                            <FaTasks />
                            <span className="ms-3">Tasks</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/settings" className='flex items-center p-2 text-2xl rounded-lg hover:bg-gray-200 transition-colors'>
                            <IoSettings />
                            <span className="ms-3">Settings</span>
                        </Link>
                    </li>
                    <li>
                        {session?
                            (
                            <button className='flex items-center p-2 text-2xl cursor-pointer' onClick={() => {
                                Cookies.remove("token");
                                signOut({ callbackUrl: "/login"})
                                }}
                            >
                                <PiSignOutBold />
                                <span className="ms-3">Logout</span> 
                            </button>  
                            ):(
                        <Link href="/login" className='flex items-center p-2 text-2xl cursor-pointer'>
                            <PiSignInBold />
                            <span className="ms-3 whitespace-nowrap">SignIn</span>
                        </Link>
                            )
                        }
                    </li>
                </ul>
            </div>
        <button className="flex-1 flex flex-col w-full lg:ml-64"
                        onClick={() => setIsOpen(false)}>
            <div className="">
                {/* Mobile Navbar */}
                <header className="flex lg:hidden p-4 bg-gray-100 shadow bg-red-400 active:bg-red-600 font-medium text-2xl">
                        <div>
                            <IoCloseCircleSharp />
                        </div>
                    <span className="ms-3 whitespace-nowrap">Close</span>
                </header>
            </div>
        </button>
     </aside>
     </div>
     </>
  )
}

export default SideBar