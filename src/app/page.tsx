"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { LogIn, LogOut, Search } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<Data[] | []>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<userType | any>(null);

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("token")) {
        return sessionStorage.getItem("token");
      }

      const response = await fetch("/api/user/session/token/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      return data.token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) {
          console.warn("No token available");
          return;
        }

        const response = await fetch(`/api/user/session/token/check`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenTemp}` },
        });

        if (!response.ok) {
          console.error(`Fetch error: ${response.status}`);
          return;
        }

        const text = await response.text();
        if (text) {
          const check = JSON.parse(text);
          setUser(check);
        } else {
          console.warn("Empty response");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    }

    if (user === null) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/post")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  function search() {
    window.location.href = "/search/" + searchTerm;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/session/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        sessionStorage.clear();
        window.location.href = "/";
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <>
      <div className="d-flex mt-3 mx-4 gap-3 flex-row-reverse">
        {user ? (
          <>
            <button
              className="px-3 rounded-pill bd-highlight btn btn-light text-dangr"
              onClick={handleLogout}
            >
              <LogOut />
            </button>
          </>
        ) : (
          <a
            href="/user/login"
            className="pe-3 rounded-pill bd-highlight btn btn-light hover-text-primary"
          >
            <LogIn />
          </a>
        )}
        <a
          href="https://kamusrejang.glitch.me"
          className="py-2 bd-highlight hover-text-danger"
        >
          Kamus Bahasa Rejang
        </a>
        <a href="/quiz" className="py-2 bd-highlight hover-text-primary">
          Quiz
        </a>
      </div>

      <div className="container">
        <div className="h-100 d-flex justify-content-center flex-column">
          <div className="header text-dark text-center rounded-bottom">
            <img
              id="logo"
              draggable="false"
              className="border-0"
              src="/logo.png"
            />
          </div>

          <div className="mt-4 mb-4 d-flex justify-content-center position-relative">
            <Search className="position-absolute search-icon" />
            <input
              autoComplete="off"
              type="text"
              className="form-control search-input custom-input mr-1 rounded-pill p-3 px-4 ps-5"
              id="searchInput"
              onKeyUp={(e) => {
                //@ts-ignore
                setSearchTerm(e.target.value);
                if (e.key === "Enter") {
                  search();
                  return;
                }
              }}
              placeholder="Search"
            />
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary px-4 btn-lg" onClick={search}>
              Cari Apo
            </button>

            <Tooltip
              title={`${!user ? "Kamu perlu masuk" : "Tulis Artikel"}`}
              arrow
              slots={{
                transition: Zoom,
              }}
            >
              <a
                className={`btn btn-secondary px-3 btn-lg ${!user}`}
                href={user ? "/post/create" : "/user/login"}
              >
                Tulis Artikel
              </a>
            </Tooltip>
          </div>
          <div className="d-flex justify-content-center gap-2 mt-4">
            <p>
              Baca juga:{" "}
              <a href="https://mfathinhalim.github.io" className="text-sec">
                Tentang Fathin
              </a>
            </p>

            <a className="text-sec" href="/rules">
              Peraturan Artikel
            </a>
          </div>
        </div>
        <h4 className="mt-3">Artikel Pilihan</h4>
        {loading ? (
          <div className="row">
            {[...Array(3)].map((_, index) => (
              <div className="col mt-2" key={index}>
                <div
                  className="card"
                  style={{
                    background: "rgba(0, 0, 0, 0)",
                    border: "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <h6
                    className="mt-2 placeholder-title"
                    style={{
                      backgroundColor: "var(--primary)",
                      height: "1em",
                      width: "70%",
                      borderRadius: "4px",
                    }}
                  ></h6>
                  <div
                    className="listing-image rounded"
                    style={{
                      width: "100%",
                      height: "150px",
                      backgroundColor: "var(--secondary)", // warna abu-abu
                      borderRadius: "10px",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="row">
              {data.map((entry, index) => (
                <div className="col mt-2" key={entry.id}>
                  <a
                    className={`card ${index % 2 === 0 ? "hover-text-primary" : "hover-text-secondary"}`}
                    href={`/post/${entry.id}`}
                    style={{
                      background: "rgba(0, 0, 0, 0)",
                      border: "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  >
                    <h6
                      className="card-title mb-2"
                      style={{
                        margin: 0,
                        maxHeight: "1.2em",
                        overflow: "hidden",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.Title}
                    </h6>
                    <img
                      className="listing-image rounded"
                      src={
                        entry.Image ||
                        "https://e1.pxfuel.com/desktop-wallpaper/908/281/desktop-wallpaper-non-copyrighted-no-copyright.jpg"
                      }
                      alt={entry.Title}
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
