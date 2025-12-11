"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/quiz/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard.");

        const json = await res.json();
        setData(json.leaderboard || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status"></div>
        <p className="mt-2">Loading leaderboard...</p>
      </div>
    );

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className={`container d-flex justify-content-center`}>
      <div className={styles.container}>
        <h1 className="fw-bold mb-4">Leaderboard</h1>

        <div className="list-group">
          {data.length === 0 && (
            <div className="list-group-item leader-item text-center">
              Belum ada data.
            </div>
          )}

          {data.map((user, i) => (
            <div
              key={user._id || i}
              className="list-group-item leader-item d-flex align-items-center justify-content-between mb-2"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="rank-circle d-flex align-items-center justify-content-center">
                  {i + 1}
                </div>

                <div>
                  <div className="fw-semibold">{user.username}</div>
                  <small className="text-mute">User Rank</small>
                </div>
              </div>

              <div className="fw-bold">{user.quizScore}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
