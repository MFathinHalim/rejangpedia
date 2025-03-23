"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FormDataState {
  title: string;
  link: string;
  pembuat: string;
  image: File | null;
}

const NewArticle = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    link: "",
    pembuat: "",
    image: null,
  });
  const [content, setContent] = useState("");
  
  const [user, setUser] = useState<userType | any>(null);
  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("token")) {
        return sessionStorage.getItem("token");
      }

      const response = await fetch("/api/user/refreshToken", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });

      if (!response.ok) {
        return (window.location.href = "/");
      }

      const data = await response.json();
      if (!data.token) return window.location.href = "/";
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
          window.location.href = "/user/login";
        }

        const check = await response.json();
        setUser(check);

      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    }

    // Only fetch data if user is null
    if (user === null) {
      fetchUserData();
    }
  }, [user]);
  const previewPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("link", formData.link);
    data.append("pembuat", user.username);
    data.append("content", content)
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Artikel berhasil dikirim!");
      } else {
        alert("Gagal mengirim artikel.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div className="container">
      <h1>Artikel Baru</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group mb-2">
          {preview && (
            <img src={preview} style={{ height: "250px", objectFit: "contain", background: "rgba(0, 0, 0, 0)", borderRadius: "12px" }} className="img-fluid" alt="Preview" />
          )}
        </div>
        <div className="form-group mb-2">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="link">Link Video (Optional):</label>
          <input type="text" id="link" name="link" className="form-control" value={formData.link} onChange={handleChange} />
        </div>

        <div className="form-group mb-2">
          <label htmlFor="image">Cover Image:</label>
          <div className="custom-file-input-wrapper">
            <input
              type="file"
              name="image"
              id="image"
              className="shadow-sm rounded border border-secondary p-2 w-100"
              required
              onChange={previewPhoto}
            />
          </div>
        </div>
        <div className="form-group mb-2">
          <ReactQuill id="content" className="form-control" value={content} onChange={setContent} />
        </div>
        <button type="submit" className="btn btn-primary btn-lg mt-3 rounded-lg">
          <i className="fa fa-paper-plane" aria-hidden="true"></i> Kirim
        </button>
      </form>
    </div>
  );
};

export default NewArticle;