"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.module.css";
import LoadingSpinner from "@/components/Loading";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null); // Token sebagai state
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const refreshAccessToken = async () => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      window.location.href = "/home";
    }

    const response = await fetch("/api/user/session/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        setToken(data.token); // Set token ke state
        sessionStorage.setItem("token", data.token);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/user/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        sessionStorage.setItem("token", data.token);
        window.location.href = "/home";
      }
    } else {
      setErrorMessage(
        response.status === 401
          ? "Invalid username or password. Please try again."
          : "Server error. Please try again later.",
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="content">
        <div className="space-y-4">
          <div className="header text-center rounded-bottom">
            <a href="/">
              <img
                id="logo"
                draggable="false"
                className="border-0"
                src="/logo.png"
              />
            </a>
          </div>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2 mt-3">
              <label
                htmlFor="username"
                className="mb-2 block font-semibold mb-1 h5"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control background-dark border-2 px-3 py-3 border-secondary rounded p-2"
                placeholder="Enter your username..."
                maxLength={16}
                required
              />
            </div>

            <div className="mt-4 mb-3 relative">
              <label
                htmlFor="password"
                className="mb-2 block font-semibold mb-1 h5"
              >
                Password
              </label>
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control background-dark border-2 border-secondary rounded px-3 py-3 flex-grow"
                  placeholder="Enter your password..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-info mt-3 "
                  aria-label="Toggle Password Visibility"
                >
                  Show Password{" "}
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-lg btn-primary w-100 rounded"
              >
                Masuk
              </button>
            </div>
            <h5 className="mt-3">
              Belum punya akun?{" "}
              <a
                href="/user/signup"
                className="bold text-info text-decoration-underline"
              >
                Daftar
              </a>
            </h5>
          </form>
        </div>
      </div>
    </div>
  );
}
