"use client";

import React, { useEffect, useState } from "react";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlZGR5IiwiZXhwaXJlc0F0IjoxNzI5NjI0NDI2LCJpYXQiOjE3Mjk2MjM1MjYsImV4cCI6MTcyOTY0MTUyNn0.notmLNCLOu0kVS3Gc8kzrV9r-EF0SaF7XpUASZFFgF8";

export const Form = () => {
  const [base64str, setBase64str] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    async function editAvatar() {
      try {
        const response = await fetch("../api/auth/protected/edit-avatar", {
          method: "POST",
          body: JSON.stringify({
            file: base64str,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        console.log(result);
        if (result.status === 200) {
          alert("Upload successful");
          setAvatarUrl(base64str as string);
        } else {
          alert("Upload failed: " + result.error);
        }
      }
      catch (e) {
        console.log(e);
        console.log("something went wrong with editAvatar()");
      }
    };
    if (base64str) editAvatar();
    console.log("use effect ran");
  }, [base64str]);

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            // convert to base 64
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              setBase64str(result);
            };
            reader.readAsDataURL(file);
          }
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
