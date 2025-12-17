"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import LoadingSpinner from "@/components/Loading";
import { Tooltip, Zoom } from "@mui/material";
import { Heart, Pencil, Send } from "lucide-react";
import Swal from "sweetalert2";

interface ArticlePageProps {
  id: any; // Receive `id` as props from the parent
}

const ArticlePage: React.FC<ArticlePageProps> = ({ id }) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/post/${id}`) // Fetch the article based on the provided `id`
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }
  async function copyLink() {
    const currentUrl = `${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.Title + " rejangpedia",
          text: "Artikel di rejangpedia, menarik nih",
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert("Link copied to clipboard. Share it with your friends!");
      } catch (error) {
        console.error("Clipboard write error", error);
        alert("Failed to copy link.");
      }
    }
  }
  return (
    <div className={`container d-flex justify-content-center`}>
      <div className={styles.container}>
        <div className="w-100 d-flex flex-column">
          <h1 id="title">{data.Title}</h1>

          <p
            className="dibuat mr-auto"
            style={{
              fontSize: "15px",
              maxWidth: "100%",
              paddingLeft: "10px",
              borderLeft: "3px solid #424347",
            }}
          >
            <span className="text-primar">Ditulis oleh</span> {data.Pembuat}{" "}
            {data.Waktu ? ` pada ${data.Waktu}` : " pada 07 Maret 2023"}
            {data.Diedit && (
              <>
                <br />
                <span className="text-sec">Diedit oleh</span> {data.Diedit}{" "}
                {"pada "}{" "}
                {data.Edit && data.Edit !== "tidak ada waktu"
                  ? `${data.Edit}`
                  : "07 Maret 2023"}
              </>
            )}
          </p>
          <div style={{ width: !data.Link ? "100%" : "auto" }}>
            <div
              className={`d-flex flex-column flex-md-row gap-1 ${!data.Link && "w-100"}`}
            >
              <div
                id="carouselExampleControls"
                className="carousel slide w-100"
                data-bs-interval="false"
                data-bs-cycle="false"
              >
                <div className="carousel-inner">
                  {data.Image && (
                    <div className="carousel-item active">
                      <img
                        src={data.Image}
                        className="d-block w-100"
                        alt={data.Title}
                        style={{
                          height: "350px",
                          objectFit: "contain",
                          borderRadius: "12px",
                        }}
                      />
                    </div>
                  )}

                  {data.Link && (
                    <div className="carousel-item">
                      <iframe
                        className="d-block w-100"
                        src={data.Link}
                        title={data.Title}
                        style={{
                          width: "100%",
                          height: "350px",
                          borderRadius: "12px",
                          objectFit: "cover",
                        }}
                      ></iframe>
                    </div>
                  )}
                </div>
                {data.Link && data.Image && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleControls"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselExampleControls"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tombol disinkronkan width-nya dengan gambar/link */}
            <div className="d-flex flex-column mt-2 gap-2">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <Tooltip
                    title="Siapa penulisnya?"
                    arrow
                    slots={{ transition: Zoom }}
                  >
                    <button
                      className="hover-text-danger bg-transparent border-0 p-0"
                      onClick={() => {
                        Swal.fire({
                          title: "Siapa penulisnya?",
                          text: "Penulisnya adalah " + data.Pembuat,
                          icon: "question",
                        });
                      }}
                    >
                      <Heart />
                    </button>
                  </Tooltip>

                  <div>
                    <button
                      className="hover-text-primary bg-transparent border-0 p-0 w-100"
                      onClick={copyLink}
                    >
                      <Send />
                    </button>
                  </div>
                </div>

                <Tooltip
                  title="Kamu perlu masuk terlebih dahulu"
                  arrow
                  slots={{ transition: Zoom }}
                >
                  <a
                    className="hover-text-secondary"
                    href={`/post/edit/${data.id}`}
                  >
                    <Pencil />
                  </a>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="text-justify w-100 mt-0">
            {Array.isArray(data.Content) && data.Content.length > 0 ? (
              data.Content.map((bab: any, index: any) => (
                <div className="mb-4 mt-2" key={index}>
                  <h3>{bab.babTitle}</h3>
                  <p
                    id={bab.babTitle}
                    className="text-justify"
                    dangerouslySetInnerHTML={{ __html: bab.babContent }}
                  ></p>
                </div>
              ))
            ) : (
              <p
                id={data.Title}
                className="text-justify"
                dangerouslySetInnerHTML={{ __html: data.Content }}
              ></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
