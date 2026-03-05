"use client";
import { useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import LoadingSpinner from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FormDataState {
  title: string;
  link: string;
  pembuat: string;
  image: File | null;
}

type ContentType = { babTitle: string; babContent: string }[] | string;

const EditArticle = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    link: "",
    pembuat: "",
    image: null,
  });

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentType>("");
  const { user, token } = useAuth();

  useEffect(() => {
    fetch(`/api/post/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setFormData({
            title: data.data.Title,
            link: data.data.Link || "",
            pembuat: data.data.Pembuat || "",
            image: null,
          });

          if (data.data.Image) {
            setPreview(data.data.Image);
          }

          // Handle Content as Array or String
          if (Array.isArray(data.data.Content)) {
            setContent(data.data.Content);
          } else {
            setContent(data.data.Content || "");
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

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

  const handleContentChange = (
    value: string,
    index?: number,
    isTitle?: boolean,
  ) => {
    if (Array.isArray(content) && index !== undefined) {
      const newContent = [...content];
      if (isTitle) {
        newContent[index].babTitle = value;
      } else {
        newContent[index].babContent = value;
      }
      setContent(newContent);
    } else {
      setContent(value); // Handle as string if not array
    }
  };

  const addNewBab = () => {
    if (Array.isArray(content)) {
      setContent([...content, { babTitle: "", babContent: "" }]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("link", formData.link);
    data.append("pembuat", formData.pembuat);
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append("content", JSON.stringify(content)); // Serialize content array or string

    try {
      const response = await fetch("/api/post/edit/" + id, {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container" id="container">
      <h1>Edit Artikel</h1>
      <p>
        Jangan lupa membaca{" "}
        <a href="/rules" className="link">
          Peraturan
        </a>
      </p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group mb-2">
          {preview && (
            <img
              src={preview}
              style={{
                height: "250px",
                objectFit: "contain",
                background: "rgba(0, 0, 0, 0)",
                borderRadius: "12px",
              }}
              className="img-fluid"
              alt="Preview"
            />
          )}
        </div>

        <div className="form-group mb-2">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-2">
          <label htmlFor="link">Link Video (Optional):</label>
          <input
            type="text"
            id="link"
            name="link"
            className="form-control"
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-2">
          <label htmlFor="image">Cover Image:</label>
          <div className="custom-file-input-wrapper">
            <input
              type="file"
              name="image"
              id="image"
              className="shadow-sm rounded border border-secondary p-2 w-100"
              onChange={previewPhoto}
            />
          </div>
        </div>

        <div className="form-group mb-2">
          {Array.isArray(content) ? (
            <>
              {content.map((bab, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Judul Bab"
                    value={bab.babTitle}
                    onChange={(e) =>
                      handleContentChange(e.target.value, index, true)
                    }
                  />
                  <ReactQuill
                    className="form-control"
                    value={bab.babContent}
                    onChange={(value) =>
                      handleContentChange(value, index, false)
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={addNewBab}
              >
                Tambah Bab Baru
              </button>
            </>
          ) : (
            <ReactQuill
              className="form-control"
              value={content}
              onChange={(value) => setContent(value)}
            />
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg mt-3 rounded-lg"
        >
          <i className="fa fa-paper-plane" aria-hidden="true"></i> Kirim
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
