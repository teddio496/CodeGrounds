import { useEffect, useState } from "react";
import { toast } from "sonner";

const RegisterModal = ({ isOpen, onClose, setIsLoggedIn }: { isOpen: boolean; onClose: () => void; setIsLoggedIn: (status: boolean) => void; }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(); // Close the modal when Escape key is pressed
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Register the user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Send cookies with the request
    });

    const data = await res.json();

    if (res.ok) {
      // After successful registration, log the user in by calling the login endpoint
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Assuming the same username and password for login
        credentials: "include", // Include cookies with the request
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        setIsLoggedIn(true); // Automatically log the user in
        onClose(); // Close the modal
        toast("You have been successfully signed up and logged in!");
      } else {
        setError(loginData.message || "Login failed after registration.");
      }
    } else {
      setError(data.message || "Something went wrong during registration.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="dark:bg-[#222222] bg-white p-6 rounded shadow-md relative dark:text-white">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">✕</button>
        <h2 className="text-xl font-semibold">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label htmlFor="username" className="block text-sm">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full bg-transparent dark:border-white border-black"
            />
          </div>
          <div className="my-4">
            <label htmlFor="password" className="block text-sm">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full bg-transparent dark:border-white border-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            <button type="submit" className="bg-transparent py-2 px-4 rounded border dark:border-white border-black dark:hover:bg-[#333333] hover:bg-gray-200 transition">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
