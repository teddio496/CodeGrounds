import { useState, useEffect } from "react";
import { toast } from "sonner";

const LoginModal = ({ isOpen, onClose, setIsLoggedIn, setAvatarUrl }: { isOpen: boolean; onClose: () => void; setIsLoggedIn: (status: boolean) => void; setAvatarUrl: (url: string) => void }) => {
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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Include cookies for the request
    });

    const data = await res.json();
    if (res.ok) {
      setIsLoggedIn(true); // Login successful, update state to logged in
      const userRes = await fetch("/api/auth/protected/profile/get-user", {
        method: "GET",
        credentials: "include",
      });
      if (userRes.ok) {
        const { user } = await userRes.json();
        setAvatarUrl(user.avatar);
      }
      onClose(); // Close the modal
      toast("You have been successfully logged in!");
    } else {
      setError(data.message || "Something went wrong!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="dark:bg-[#222222] bg-white dark:text-white p-6 rounded shadow-md relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-3 text-lg font-bold">✕</button>
        <h2 className="text-xl font-semibold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label htmlFor="username" className="block text-sm">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 p-2 border dark:border-white border-black rounded w-full bg-transparent "
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
              className="mt-1 p-2 border dark:border-white border-black rounded w-full bg-transparent"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            <button type="submit" className="bg-transparent border dark:border-white border-black py-2 px-4 rounded dark:hover:bg-[#333333] hover:bg-gray-200 transition">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
