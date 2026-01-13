"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Code, User, LogOut } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import GlassSurface from "./GlassSurface";
import Loader from "../ui/loader";
import { Button } from "../ui/button";

const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Problems", path: "/problems", isProtected: true },
    { name: "Learn", path: "/learn", isProtected: false },
    { name: "Playlists", path: "/playlists", isProtected: false },
    { name: "Contact Us", path: "/contact", isProtected: false },
    { name: "Dashboard", path: "/dashboard", isProtected: true },
  ];

  const adminNavLinks = [
    ...navLinks,
    { name: "Add problem", path: "/add-problem", isProtected: true },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 p-0 m-0`}>
        <div className="relative w-full flex justify-center">
          <GlassSurface width="100%" height="100%" borderRadius={8}>
            <div
              className={`transition-all duration-700 ease-in-out transform-gpu ${
                scrolled
                  ? "w-full scale-x-100 rounded-none"
                  : "w-full max-w-5xl scale-x-100 rounded-2xl mt-0"
              }`}
              style={{
                transformOrigin: "center",
                ...(scrolled
                  ? {
                      borderRadius: "0px",
                      maxWidth: "100%",
                      marginLeft: "-1rem",
                      marginRight: "-1rem",
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                    }
                  : {}),
              }}
            >
              <div className="">
                <div className="flex items-center justify-between h-12">
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="flex items-center text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                      {/* <Code className="h-8 w-8 mr-2" /> */}
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 91 187"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M39.28 63.352H56.56L43.12 138.616H82.032L79.088 155H23.024L39.28 63.352Z"
                          fill="white"
                        />
                        <path
                          d="M17.28 31.352H34.56L21.12 106.616H60.032L57.088 123H1.024L17.28 31.352Z"
                          fill="white"
                        />
                      </svg>
                      <span className="font-bold text-xl text-white">Love Leetcode</span>
                    </Link>
                  </div>

                  <div className="hidden md:block">
                    <div className="ml-10 flex items-center space-x-4">
                      {(user?.role === "ADMIN" ? adminNavLinks : navLinks).map(
                        (link) => (
                          <Link
                            key={link.name}
                            href={
                              link.isProtected && !isAuthenticated
                                ? "/auth"
                                : link.path
                            }
                            className={`px-3 py-2 text-sm font-medium transition-colors duration-200  ${
                              pathname === link.path
                                ? "text-lime-400"
                                : "text-gray-300 hover:text-lime-400"
                            }`}
                          >
                            {link.name}
                          </Link>
                        )
                      )}

                      {isLoading ? (
                        <div className="flex items-center">
                          <Loader />
                        </div>
                      ) : isAuthenticated ? (
                        <>
                          <Link
                            href="/dashboard"
                            className="rounded-full text-gray-300 hover:text-lime-400 focus:outline-none cursor-pointer"
                          >
                            {user?.image ? (
                              <img
                                src={user?.image}
                                alt="Profile"
                                className="w-8 h-8 rounded-full hover:scale-105 transition-all duration-200 cursor-pointer"
                              />
                            ) : (
                              <User size={20} />
                            )}
                          </Link>
                          <Button
                          variant="outline"
                            onClick={logout}
                            className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-rose-600 hover:text-white cursor-pointer"
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Link href="/auth" className="cursor-pointer">
                          <Button
                            variant="outline"
                            className="rounded-full border-purple-500/30 bg-transparent text-white hover:bg-purple-500/40 hover:text-white cursor-pointer"
                            size="lg"
                          >
                            Login / Sign Up
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="md:hidden">
                    <button
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                    >
                      {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
                <div className="relative px-2 pt-2 pb-3 space-y-1 backdrop-blur-sm sm:px-3 shadow-lg">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === link.path
                          ? "text-indigo-400 bg-gray-800"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2">
                    <Link
                      href="/profile"
                      className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </GlassSurface>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
