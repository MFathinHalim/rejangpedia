"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react"; // Menggunakan Lucide icon (alternatif: FontAwesome)

const Navbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const pathname = usePathname();

  useEffect(() => {
    const extractedTerm = pathname.split("/search/")[1] || "";
    setSearchTerm(decodeURIComponent(extractedTerm));
  }, [pathname]);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.js");
  }, []);

  if (pathname === "/home" || pathname === "/search" || pathname === "/")
    return;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  function search() {
    window.location.href = `/search/${searchTerm}`;
  }

  return (
    <>
      {!pathname.includes("user") && (
        <nav className="navbar sticky-top w-100 py-1" id="khususDekstop">
          <div
            className={`container-fluid d-flex align-items-center justify-content-between`}
          >
            <a className="navbar-brand me-3 ms-0" href="/">
              <img src="/logo-icon.png" width="45" height="45" alt="Logo" />
            </a>

            {/* Form dengan icon di dalam input */}
            <form className="d-none d-lg-flex flex-grow-1 position-relative">
              <Search
                className="position-absolute"
                style={{
                  color: "gray",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                autoComplete="off"
                type="text"
                className="form-control py-2 px-5 rounded-pill shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    search();
                  }
                }}
                placeholder="Cari apa di rejangpedia?"
              />
            </form>

            <div className="d-flex align-items-center ms-3">
              <a className="text-decoration-none mx-2" href="/quiz">
                Quiz
              </a>
              <a className="text-decoration-none mx-2" href="/search">
                Jelajahi
              </a>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
