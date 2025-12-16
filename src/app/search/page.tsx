"use client";
import PostShortcut from "@/components/PostShortcut";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Compass } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const PostList = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Current page for infinite scroll
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Infinite Scroll: Fetch more posts on scroll
  const fetchPosts = async (pageNum: number) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/post/admin?page=${pageNum}`, {
        method: "GET",
      });
      const result = await res.json();
      setData((prevData) => [...prevData, ...result.posts]); // Append new posts
      console.log(data);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
      !isLoading
    ) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  }, [isLoading]);

  function search() {
    window.location.href = "/search/" + searchTerm;
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Clean up
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1)
      fetchPosts(page); // Fetch posts on page change
    else fetchPosts(1); // Initial fetch
  }, [page]);

  return (
    <>
      <div className="d-flex mt-3 mx-4 gap-3 flex-row-reverse">
        <a
          href="https://kamusrejang.glitch.me"
          className="py-2 bd-highlight hover-text-danger"
        >
          Kamus Bahasa Rejang
        </a>
        <a href="/home" className="py-2 bd-highlight text-decoration-underline">
          Halaman Utama
        </a>
      </div>
      <div className="container">
        <div className="d-flex justify-content-center flex-column">
          <div className="header text-center rounded-bottom">
            <a href="/home">
              <img
                id="logo"
                draggable="false"
                className="border-0"
                src="/logo.png"
              />
            </a>
          </div>

          <div className="mt-4 mb-4 d-flex justify-content-center position-relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="position-absolute search-icon"
            />
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
        </div>
        <ul className="list-group pl-2 pr-2">
          <h1 className="mb-3">
            Jelajahi <Compass />
          </h1>

          {data.map((entry: any) => (
            <div key={entry._id}>
              <PostShortcut post={entry} />
            </div>
          ))}
          {isLoading &&
            [...Array(3)].map((_, index) => (
              <div
                key={index} // Tambahkan key untuk setiap elemen yang di-loop
                className="listing-image rounded my-2"
                style={{
                  width: "100%",
                  height: "150px",
                  backgroundColor: `${index % 2 === 0 ? "var(--primary)" : "var(--secondary)"}`, // warna abu-abu
                  borderRadius: "10px",
                }}
              ></div>
            ))}
        </ul>
      </div>
    </>
  );
};

export default PostList;
