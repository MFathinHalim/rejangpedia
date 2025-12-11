"use client";

import { useEffect, useState } from "react";

export default function AdminQuizPage() {
  const [user, setUser] = useState(null);
  const [soal, setSoal] = useState("");
  const [image, setImage] = useState(""); // <-- state baru untuk gambar
  const [jawaban, setJawaban] = useState([
    { jawaban: "", benar: false, score: 0 },
    { jawaban: "", benar: false, score: 0 },
    { jawaban: "", benar: false, score: 0 },
    { jawaban: "", benar: false, score: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("token"))
        return sessionStorage.getItem("token");

      const res = await fetch("/api/user/session/token/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return (window.location.href = "/");

      const json = await res.json();
      if (!json.token) return (window.location.href = "/");

      sessionStorage.setItem("token", json.token);
      return json.token;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    async function checkAdmin() {
      const token = await refreshAccessToken();
      if (!token) return;

      const res = await fetch("/api/user/session/token/check", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setUser(json);
      if (!json.atmin) window.location.href = "/";
    }

    checkAdmin();
  }, []);
  //@ts-ignore
  const updateJawaban = (idx, field, value) => {
    const copy = [...jawaban];

    //@ts-ignore
    copy[idx][field] = value;
    setJawaban(copy);
  };

  const createQuiz = async () => {
    setLoading(true);
    const token = await refreshAccessToken();
    if (!token) return alert("Token missing");

    try {
      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          soal,
          image, // <-- kirim image ke backend
          multipleQuestion: jawaban,
        }),
      });

      if (!res.ok) throw new Error("failed");

      alert("Quiz created!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  if (user === null) return <p>loading...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto container">
      <h2 className="mb-3">Admin Quiz Creator</h2>

      <label>Soal Quiz</label>
      <textarea
        className="form-control mb-3"
        rows={3}
        value={soal}
        onChange={(e) => setSoal(e.target.value)}
      />

      <label>Link Gambar (Opsional)</label>
      <input
        className="form-control mb-3"
        placeholder="https://contoh.com/image.jpg"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <h5>Jawaban</h5>
      {jawaban.map((j, i) => (
        <div key={i} className="rounded mb-3">
          <input
            className="form-control mb-2"
            placeholder={`Jawaban ${i + 1}`}
            value={j.jawaban}
            onChange={(e) => updateJawaban(i, "jawaban", e.target.value)}
          />

          <label className="mt-2">Benar?</label>
          <select
            className="form-control mb-2"
            value={j.benar ? "true" : "false"}
            onChange={(e) =>
              updateJawaban(i, "benar", e.target.value === "true")
            }
          >
            <option value="false">Salah</option>
            <option value="true">Benar</option>
          </select>

          <label>Score</label>
          <input
            type="number"
            className="form-control"
            value={j.score}
            onChange={(e) => updateJawaban(i, "score", Number(e.target.value))}
          />
        </div>
      ))}

      <button
        onClick={createQuiz}
        className="btn btn-primary mt-2"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Quiz"}
      </button>
    </div>
  );
}
