"use client";

import React, { useState, useEffect } from "react";

interface AvatarProps {
  initialAvatarUrl: string;
}

const Avatar = ({ initialAvatarUrl }: AvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl);
  const [form, setForm] = useState<FormData | null>(null);

  useEffect(() => {
    // Update avatar on server when form data is set
    const editAvatar = async () => {
      if (!form) return;

      try {
        const response = await fetch("/api/auth/protected/profile/edit-avatar", {
          method: "PUT",
          body: form,
          credentials: "include",
        });
        const { updatedUser } = await response.json();
        //console.log("UPDATED USER AFTER AVATAR UPLOAD:", updatedUser);

        if (response.ok) {
          setAvatarUrl(updatedUser.avatar as string);
          alert("Upload successful");
        } else {
          const redirectUrl = response.headers.get("Location");
          if (redirectUrl) {
            window.location.href = redirectUrl;  // Let the browser handle the redirection and use GET
          }
        }
      } catch (e) {
        console.error("something went wrong with editAvatar()", e);
      }
    };

    editAvatar();
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setForm(formData); // Trigger useEffect to handle upload
    }
  };

  return (
    <div className="relative">
      <div className="relative group">
  <label className="cursor-pointer">
    <img
      src={avatarUrl}
      alt="User Avatar"
      className="w-40 h-40 rounded-full object-cover"
    />
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
    <span className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
      Edit Avatar
    </span>
  </label>
</div>


      {/* 
      <div className="ml-2 relative group">
        <span className="text-red-500 font-bold">!</span>
        <div className="absolute left-0 mt-2 w-48 p-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Note: The weight does not sum to 100, so a different algorithm is being used.
        </div>
      </div>
      */}

      <style jsx>{`
        label:hover img {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default Avatar;
