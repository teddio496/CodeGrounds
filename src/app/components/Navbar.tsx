"use client";

import { useState, useEffect } from "react";
import LoginModal from "./auth/login/LoginModal";
import RegisterModal from "./auth/register/RegisterModal";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/uploads/avatar.jpg");
  const router = useRouter();

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  // Check if user is logged in on initial load by making an API request to verify the token
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth/checkAuth", {
          method: "GET",
          credentials: "include", // Ensure cookies are included
        });
        if (res.ok) {
          setIsLoggedIn(true);
          const userRes = await fetch("api/auth/protected/profile/get-user", {
            method: "GET",
            credentials: "include"
          });
          if (userRes.ok) {
            const { user } = await userRes.json();
            //console.log("USER: ", user.avatar);
            setAvatarUrl(user.avatar);
          }
          //console.log("USER IS STILL LOGGED IN");
        } else {
          setIsLoggedIn(false);
          //console.log("USER IS LOGGED OUT / TOKEN EXPIRED");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <div>
      <nav className="sticky top-0 left-0 w-full bg-white shadow-md py-3 px-6 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="my-auto text-xl font-semibold">Scriptorium</div>
          <div className="flex flex-row text-sm">
            <div className="my-auto px-2 hover:underline" onClick={() => router.push("/blogs")}>Blogs</div>
            <div className="my-auto px-2 hover:underline">Templates</div>
            <div className="my-auto px-2 hover:underline">Exeuction</div>
          </div>
          <div>
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => {
                    // Handle logout by removing the token (HTTP-only cookies)
                    await fetch("/api/auth/protected/logout", {
                      method: "POST",
                      credentials: "include", // Send cookies with the request
                    });
                    setIsLoggedIn(false); // Update the state to show login/signup buttons again
                    router.push("/");
                  }}
                  className="py-1 px-2 text-[0.7rem] bg-red-500 text-white rounded hover:bg-red-600 transition "
                >
                  Logout
                </button>
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => router.push("/profile")} // Redirect to profile page
                />
              </div>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={openLoginModal}
                  className="py-1 px-2 text-[0.7rem]  bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Login
                </button>
                <button
                  onClick={openRegisterModal}
                  className="py-1 px-2 text-[0.7rem]  bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} setIsLoggedIn={setIsLoggedIn} setAvatarUrl={setAvatarUrl} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default Navbar;
