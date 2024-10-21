"use client";

import React, { useState } from "react";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlZGR5IiwiZXhwaXJlc0F0IjoxNzI5NTMzODQxLCJpYXQiOjE3Mjk1MzI5NDEsImV4cCI6MTcyOTUzNDc0MX0.bXxEw12uU-SdtU1ebGpL8CICQXirsVUvVvHQ7w5IRXo";

export const Form = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={async (e) => {
          if (e.target.files) {
            const formData = new FormData();
            Object.values(e.target.files).forEach((file) => {
              formData.append("file", file);
            });

            const response = await fetch("../api/auth/protected/edit-avatar", {
              method: "POST",
              body: formData,
              headers: {
                "Authorization": `Bearer ${token}`,
              }
            });

            const result = await response.json();
            console.log(result);
            if (result.success) {
              alert("Upload successful");
              setImageUrl(result.fileUrl);
            } else {
              alert("Upload failed: " + result.error);
            }
          }
        }}
      />
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded Avatar" style={{ maxWidth: "200px", maxHeight: "200px" }} />
        </div>
      )}
    </div>
  );
};
