"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
const Navbar = () => {
  const { isLoaded, userId } = useAuth();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scroll
          ? "bg-white bg-opacity-10 backdrop-blur-lg border-b border-white/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <ul className="flex justify-between py-4 px-6">
        <div className="text-3xl">
            TickTodos
        </div>
        {!userId || !isLoaded ? (
          <div className="flex gap-6 items-center">
            <Link href={"/sign-in"}>
              <li className="font-semibold rounded-full bg-green-300 hover:bg-green-500 py-2 px-4">
                Login
              </li>
            </Link>
            <Link href={"/sign-up"}>
              <li className="font-semibold rounded-full bg-red-300 hover:bg-red-500 py-2 px-4">
                Sign Up
              </li>
            </Link>
          </div>
        ) : (
          <div className="flex gap-6 items-center">
            <Link href={"/profile"}>
              <li className="nav-item font-semibold">Profile</li>
            </Link>
            <li className="flex items-center">
              <UserButton />
            </li>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
