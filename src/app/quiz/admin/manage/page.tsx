// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

export default function AdminManageQuiz() {
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch {
      return null;
    }
  };

  // check admin
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

  const loadQuiz = async () => {
    setLoading(true);
    const token = await refreshAccessToken();
    if (!token) return;

    try {
      const req = await fetch("/api/quiz/list", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await req.json();
      setQuizzes(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadQuiz();
  }, [user]);

  const deleteQuiz = async (id) => {
    if (!confirm("Yakin mau hapus quiz ini?")) return;

    const token = await refreshAccessToken();
    if (!token) return;

    try {
      const req = await fetch("/api/quiz/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });

      const res = await req.json();
      if (res.success) {
        alert("Quiz deleted!");
        setQuizzes((prev) => prev.filter((q) => q._id !== id));
      } else {
        alert("Failed to delete quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting quiz");
    }
  };

  if (!user) return <p>Loading...</p>;
  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto container">
      <h2 className="mb-3">Manage Quiz</h2>

      {quizzes.length === 0 && <p>Belum ada quiz.</p>}

      {quizzes.map((quiz) => (
        <div key={quiz._id} className="border p-3 rounded mb-3">
          <h4>{quiz.soal}</h4>
          <img src={quiz.image} alt="Quiz Image" className="mb-3 w-100" />

          <ul className="mb-2">
            {quiz.multipleQuestion.map((q, i) => (
              <li key={i}>
                {q.jawaban} {q.benar ? "(benar)" : ""} (+{q.score})
              </li>
            ))}
          </ul>

          <button
            className="btn btn-danger"
            onClick={() => deleteQuiz(quiz._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
