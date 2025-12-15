"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { Book, LogIn, LogOut, Search } from "lucide-react";
import Leaderboard from "../quiz/leaderboard/page";
import PostList from "../search/page";

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
      <div className="d-flex mt-3 mx-4 gap-3 flex-row-reverse align-items-center">
        {user ? (
          <div className="dropdown">
            <img
              src={user.avatar || "./happy.gif"}
              alt="avatar"
              width={40}
              height={40}
              data-bs-toggle="dropdown"
              style={{
                cursor: "pointer",
              }}
              className="rounded-circle"
            />

            <ul
              className="dropdown-menu dropdown-menu-end bg-transparent"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <li>
                <a className="fw-semibold dropdown-item">
                  {user.username || "User"}
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/quiz/leaderboard">
                  Leaderboard
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Keluar
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <a href="/user/login" className="btn btn-light rounded-pill">
            <LogIn />
          </a>
        )}

        <a href="/quiz" className="py-2 hover-text-primary">
          Quiz
        </a>
        <a
          href="https://kamusrejang.vercel.app"
          className="py-2 hover-text-primary"
        >
          Kamus Rejang
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

          <div className="my-4 d-flex justify-content-center position-relative">
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
          <small className="text-center mb-4">
            Budaya Rejang banyak diwariskan secara lisan. Rejangpedia hadir
            untuk mendokumentasikan, menjaga, dan meneruskannya ke generasi
            berikutnya.
          </small>

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

        <h4 className="mt-3">Hal yang Perlu Kamu Tahu</h4>
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
                <div
                  className="col-100 col-md-4 mt-3"
                  key={entry._id || entry.id}
                >
                  <a
                    href={`/post/${entry.id}`}
                    className="card text-decoration-none border-0 bg-transparent"
                  >
                    <small>Last Edit: {entry.Edit}</small>
                    <div className="position-relative mt-2">
                      <img
                        src={
                          entry.Image ||
                          "https://cbx-prod.b-cdn.net/COLOURBOX60634282.jpg?width=800&height=800&quality=70"
                        }
                        alt={
                          typeof entry.Title === "string"
                            ? entry.Title
                            : "Artikel Rejang"
                        }
                        className="card-img-top rounded-4"
                        style={{
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div className="card-body px-1 pt-3">
                      <h6
                        className="fw-semibold text-white mb-1"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {typeof entry.Title === "string"
                          ? entry.Title
                          : entry.Title || "Tanpa Judul"}
                      </h6>

                      <small>Writed by {entry.Pembuat || "Rejangpedia"}</small>
                      <p className="m-0">
                        {
                          typeof entry.Content === "string"
                            ? entry.Content.replace(/<[^>]+>/g, "").substring(
                                0,
                                100,
                              ) // Jika Content adalah string
                            : entry.Content[0]?.babContent
                                ?.replace(/<[^>]+>/g, "")
                                .substring(0, 100) // Jika Content adalah list dengan babContent
                        }
                        ...
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <a
        href="https://kamusrejang.vercel.app"
        className="btn btn-primary rounded-pill position-fixed text-center"
        style={{ bottom: "24px", left: "24px" }}
      >
        <Book /> Kamus Rejang
      </a>
    </>
  );
}
