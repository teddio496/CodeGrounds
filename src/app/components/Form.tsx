"use client";

import React, { useEffect, useState } from "react";

export const Form = () => {
  const [form, setForm] = useState<FormData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    async function editAvatar() {
      try {
        const response = await fetch("../api/auth/protected/edit-avatar", {
          method: "PUT",
          body: form,
        });
        const { updatedUser } = await response.json();
        console.log("UPDATED USER AFTER AVATAR UPLOAD: ", updatedUser);
        if (response.ok) {
          alert("Upload successful");
          setAvatarUrl(updatedUser.avatar as string);
        } else {
          alert("Upload failed");
        }
      }
      catch (e) {
        console.log("something went wrong with editAvatar()", e);
      }
    };

    if (form) editAvatar();
  }, [form]);

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          const formData = new FormData();
          formData.append("file", file as Blob);
          setForm(formData);
        }}
      />
      <div>
        <h3>Uploaded Image:</h3>
        <img
          src={avatarUrl as string}
          alt="Uploaded Avatar"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      </div>
    </div>
  );
};
