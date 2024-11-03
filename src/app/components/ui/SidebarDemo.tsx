"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconLogin,
  IconBrandTabler,
  IconTemplate,
  IconArrowRight, IconCode, IconUserCircle, IconScript, IconBrightness2, IconReport
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import LoginModal from "../auth/login/LoginModal";
import RegisterModal from "../auth/register/RegisterModal";
import { useRouter } from "next/navigation";
import { useTheme } from "@/src/context/ThemeContext";
import { toast } from "sonner";

//SideBar by Aceternity (Content of this page has been modified from the code from Aceternity UI)

export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Execution",
      href: "/editor",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Blog Posts",
      href: "/blogs",
      icon: (
        <IconTemplate className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Code Templates",
      href: "/templates",
      icon: (
        <IconCode className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Log in",
      href: "#",
      onClick: () => openLoginModal(),
      icon: (
        <IconUserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Sign up",
      href: "#",
      onClick: () => openRegisterModal(),
      icon: (
        <IconLogin className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My blogs",
      href: "/profile/my-blogs",
      icon: (
        <IconTemplate className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My templates",
      href: "/profile/my-templates",
      icon: (
        <IconCode className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Reports",
      href: "/report",
      icon: (
        <IconReport className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/uploads/avatar.jpg");
  const [role, setRole] = useState("User")
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const handleLogOut = async () => {
    // Handle logout by removing the token (HTTP-only cookies)
    await fetch("/api/auth/protected/logout", {
      method: "POST",
      credentials: "include", // Send cookies with the request
    });
    setIsLoggedIn(false); // Update the state to show login/signup buttons again
    router.push("/");
    toast("you have been successfully logged out!")
  }

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth/checkAuth", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setIsLoggedIn(true);
          const userRes = await fetch("/api/auth/protected/profile/get-user", {
            method: "GET",
            credentials: "include",
          });
          if (userRes.ok) {
            const { user } = await userRes.json();
            setAvatarUrl(user.avatar || "/uploads/avatar.jpg");
            setRole(user.role)
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-screen flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">

          {/* Side Bar Top */}
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-7 flex flex-col gap-2 ml-1">
              {links.slice(0, 3).map((link, index) => (
                <SidebarLink key={index} link={link} />
              ))}
            </div>
          </div>

          {/* Side Bar Bottom*/}
          <div className="flex flex-col gap-2 ml-1">
            <div onClick={toggleTheme}>
            <SidebarLink
                    link={{
                      label: theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode",
                      href: "#",
                      icon: (
                        <IconBrightness2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                        />
                      ),
                    }}
                    
                  />
            </div>
              
            {isLoggedIn ? (
              <>
              {role === "Admin" ? (
                <SidebarLink key={8} link={links[8]} />
              ):
                <></>
              }
              <SidebarLink key={6} link={links[6]} />
              <SidebarLink key={7} link={links[7]} />
              <div onClick={handleLogOut}>
              <SidebarLink key={5} link={links[5]} />
              </div>
                <SidebarLink
                  link={{
                    label: "Profile",
                    href: "/profile",
                    icon: (
                      <Image
                        src={avatarUrl}
                        className="h-6 w-6 flex-shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </>
            ) : (
              <>
                <div onClick={openLoginModal}>
                  <SidebarLink key={3} link={links[3]} />
                </div>
                <div onClick={openRegisterModal}>
                    <SidebarLink key={4} link={links[4]} /> 
                </div>
              </>
            )}
          </div>
        </SidebarBody>
      </Sidebar>


      {/* The Page Contents */}
      <div className="w-full bg-white  dark:bg-[#333333] min-h-[100vh] overflow-x-auto">
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          setIsLoggedIn={setIsLoggedIn}
          setAvatarUrl={setAvatarUrl}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
          setIsLoggedIn={setIsLoggedIn}
        />
        {children}
      </div>

    </div>
  );
}
  
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-red-500 py-1 relative z-20"
    >
      <IconScript className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Scriptorium
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-7 w-7 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
