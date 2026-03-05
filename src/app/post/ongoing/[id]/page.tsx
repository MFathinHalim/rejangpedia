"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ArticlePage = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { token: tokenTemp } = useAuth();

  useEffect(() => {
    fetch(`/api/post/ongoing/${id}`)
      .then((response) => response.json())
      .then((data1) => {
        setData(data1.data);
        console.log(data1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleAccept = async (id: string) => {
    if (!tokenTemp) return console.error("No token available");

    try {
      const response = await fetch(`/api/post/accept/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${tokenTemp}` },
      });

      if (response.ok) {
        console.log(`Post ${id} accepted.`);
        setData((prevData: any) =>
          prevData.filter((post: any) => post.id !== id),
        ); // Remove accepted post
      } else {
        console.error(`Failed to accept post ${id}`);
      }
    } catch (error) {
      console.error("Error accepting post:", error);
    }
  };
  const handleDelete = async (id: string) => {
    if (!tokenTemp) return console.error("No token available");

    try {
      const response = await fetch(`/api/post/delete/ongoing/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenTemp}` },
      });

      if (response.ok) {
        setData((prevData: any) =>
          prevData.filter((post: any) => post.id !== id),
        ); // Remove accepted post
      } else {
        console.error(`Failed to accept post ${id}`);
      }
    } catch (error) {
      console.error("Error accepting post:", error);
    }
  };
  return (
    <div className="container">
      <div className="col-lg-10 col-md-9">
        <div className="main-content">
          <h1 id="title">{data.Title}</h1>
          <p
            className="dibuat mr-auto"
            style={{
              fontSize: "15px",
              maxWidth: "100%",
              paddingLeft: "10px",
              borderLeft: "3px solid #138496",
            }}
          >
            <strong style={{ color: "#138496" }}>Ditulis oleh</strong>{" "}
            {data.Pembuat}
            {data.Waktu ? ` • ${data.Waktu}` : " • 07-Maret-2023"}
            {data.Diedit && (
              <>
                <br />
                <br id="x" />
                <strong style={{ color: "#138496" }}>Diedit oleh</strong>{" "}
                {data.Diedit}
                {data.Edit ? ` • ${data.Edit}` : " • 07-Maret-2023"}
              </>
            )}
          </p>

          <div className="d-flex flex-column flex-md-row">
            {data.Image && (
              <img
                className="listing-image mr-2"
                style={{
                  height: "250px",
                  border: "1px solid #ccc",
                  objectFit: "contain",
                  background: "rgba(0, 0, 0, 0)",
                  borderRadius: "12px",
                }}
                src={data.Image}
                alt={data.Title}
              />
            )}

            {data.Link && (
              <article>
                <iframe
                  style={{
                    width: "460px",
                    maxWidth: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                  }}
                  className="img-fluid"
                  src={data.Link}
                  title={data.Title}
                ></iframe>
              </article>
            )}
          </div>

          <div className="d-flex mt-3">
            <button
              className="btn btn-info rounded-pill mr-1 text-white"
              onClick={() => alert("Share functionality here!")}
            >
              <i className="fa fa-share text-white" aria-hidden="true"></i>{" "}
              Bagikan
            </button>
            <a
              className="btn btn-secondary rounded-pill"
              href={`/edit/${data.id}`}
            >
              <i className="fa fa-pencil" aria-hidden="true"></i> Edit Artikel
            </a>
            <button
              className="btn btn-secondary rounded-pill"
              onClick={() => handleAccept(data.id)}
            >
              <i className="fa fa-check" aria-hidden="true"></i> Terima
            </button>
            <button
              className="btn btn-danger rounded-pill"
              onClick={() => handleDelete(data.id)}
            >
              <i className="fa fa-trash" aria-hidden="true"></i> Delete
            </button>
          </div>

          <div style={{ borderRadius: "24px" }}>
            {Array.isArray(data.Content) && data.Content.length > 0 ? (
              data.Content.map((bab: any, index: any) => (
                <div className="my-4" key={index}>
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
