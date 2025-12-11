"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function QuizPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<any>(null);

  const refreshAccessToken = async () => {
    try {
      const cached = sessionStorage.getItem("token");
      if (cached) return cached;

      const res = await fetch("/api/user/session/token/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return (window.location.href = "/");

      const data = await res.json();
      if (!data.token) return (window.location.href = "/");

      sessionStorage.setItem("token", data.token);
      return data.token;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const fresh = await refreshAccessToken();
      if (!fresh) return;

      setToken(fresh);

      const res = await fetch("/api/user/session/token/check", {
        method: "POST",
        headers: { Authorization: `Bearer ${fresh}` },
      });

      if (!res.ok) return (window.location.href = "/user/login");

      const data = await res.json();
      setUser(data);
    }

    if (!user) fetchUser();
  }, [user]);

  const fetchNewQuiz = async () => {
    setLoading(true);
    setAnswered(false);
    setResult(null);

    const res = await fetch("/api/quiz/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    setQuiz(json);
    setLoading(false);
  };

  const answerQuiz = async (jawaban: string) => {
    setAnswered(true);

    const res = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quizId: quiz.id,
        answer: jawaban,
        username: user.username,
      }),
    });

    const json = await res.json();
    setResult(json);
  };

  return (
    <div
      className="d-flex container flex-column justify-content-center align-items-center w-100"
      style={{ minHeight: "calc(100vh - 70px)", padding: "20px" }}
    >
      <h1 className="fw-bold mb-4 fs-2 text-center">Quiz Rejang</h1>

      {/* START SCREEN */}
      {!quiz && !loading && (
        <div className="d-flex flex-column align-items-center text-center gap-3 w-100">
          <img
            src="https://shapes.inc/api/public/avatar/mahirushiina-e583"
            style={{
              width: "260px",
              height: "260px",
              objectFit: "cover",
            }}
          />

          <p className="text-muted">
            Jawab pertanyaan dan tingkatkan skor kamu.
          </p>

          <button
            className="btn btn-primary btn-lg w-75"
            onClick={fetchNewQuiz}
          >
            Mulai Quiz
          </button>

          <Link
            href="/quiz/leaderboard"
            className="btn btn-outline-secondary w-75"
          >
            Lihat Leaderboard
          </Link>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="w-100 text-center">
          <div className="placeholder-glow">
            <span className="placeholder col-8 mb-3"></span>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12"></span>
          </div>
        </div>
      )}

      {/* QUESTION */}
      {quiz && !answered && !loading && (
        <div className="d-flex flex-column align-items-center text-center gap-4 w-100">
          <img
            src={quiz.image}
            alt="Quiz Image"
            style={{ height: "350px", objectFit: "contain", width: "100%" }}
            className="mb-3 object-contain"
          />
          <h4 className="fw-semibold">{quiz.soal}</h4>

          <div className="d-flex flex-column gap-3 w-100">
            {quiz.multipleQuestion?.map((opt: any, i: number) => (
              <button
                key={i}
                className="btn btn-outline-primary btn-lg w-100"
                onClick={() => answerQuiz(opt.jawaban)}
              >
                {opt.jawaban}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {answered && result && !loading && (
        <div className="d-flex flex-column align-items-center text-center gap-3 w-100">
          <img
            src={
              result.correct
                ? "https://preview.redd.it/happy-birthday-to-mahiru-shiina-v0-7mp2g6seb25e1.jpeg?auto=webp&s=e7ba4e26a04056051d1a3b91a99427582bbf72d7"
                : "https://cdn.rafled.com/anime-icons/images/rxY7FEUrsfxxuypVEyIeXDc4Ge859OH6.jpg"
            }
            style={{
              width: "360px",
              height: "360px",
              borderRadius: "20px",
            }}
          />

          <h3 className="fw-bold mb-1">
            {result.correct ? `Benar! +${result.addedScore}` : "Salah"}
          </h3>

          <p className="text-muted">Total skor kamu: {result.totalScore}</p>

          <button
            className="btn btn-primary btn-lg w-75"
            onClick={fetchNewQuiz}
          >
            Pertanyaan Berikutnya
          </button>

          <Link
            href="/quiz/leaderboard"
            className="btn btn-outline-secondary w-75"
          >
            Lihat Leaderboard
          </Link>
        </div>
      )}
    </div>
  );
}
