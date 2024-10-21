"use client";

import React, { useEffect, useState } from "react";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlZGR5IiwiZXhwaXJlc0F0IjoxNzI5NTQ1MTU2LCJpYXQiOjE3Mjk1NDQyNTYsImV4cCI6MTcyOTU2MjI1Nn0.WHm_87bMUv19ZqcC-l2WD-Jtjn4D9Uyebf9tlgK-TWU";

export const Form = () => {
  const [base64str, setBase64str] = useState<string | null>(null);

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
        // console.log(result);
        if (result.success) {
          alert("Upload successful");
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
          const file = e.target.files?.[0]; // Get the selected file
          if (file) {
            const reader = new FileReader();

            // When file is successfully read as Data URL
            reader.onload = () => {
              const result = reader.result as string;
              setBase64str(result); // Set the Base64 string
            };

            // Read file as Data URL (Base64)
            reader.readAsDataURL(file);
          }
          console.log(base64str);
          console.log(1);
        }}
      />
      <div>
        <h3>Uploaded Image:</h3>
        <img
          src={base64str as string ?? ""}
          alt="Uploaded Avatar"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      </div>
    </div>
  );
};
