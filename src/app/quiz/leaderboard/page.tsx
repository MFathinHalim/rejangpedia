"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
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
        <h1 className="fw-bold mb-4 text-center">Leaderboard</h1>
        <div className="podium-wrapper d-flex justify-content-center align-items-end gap-3 mb-5 px-5">
          {/* urut: top2, top1, top3 */}
          {[data[1], data[0], data[2]].map((user, i) => {
            // cek user null (misal data kurang dari 3)
            if (!user) return null;

            // tinggi podium
            const heights = [200, 300, 200]; // top2, top1, top3
            const bgColors = ["info", "warning", "danger"];

            return (
              <div
                className="d-none d-md-flex w-40 flex-column align-items-center"
                key={user._id || i}
              >
                <Crown className={`text-${bgColors[i]}`} />
                <div className="fw-bold text-center mb-2">{user.username}</div>

                <div
                  className="podium-card d-flex flex-column align-items-center justify-content-end"
                  style={{
                    height: `${heights[i]}px`,
                    width: "120px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    position: "relative",
                    transition: "transform 0.2s",
                    background:
                      i === 1
                        ? "linear-gradient(to top, rgba(255, 193, 7, 0.3), rgba(255, 193, 7, 0.8))" // warning
                        : i === 0
                          ? "linear-gradient(to top, rgba(13, 110, 253, 0.3), rgba(13, 110, 253, 0.8))" // info
                          : "linear-gradient(to top, rgba(220, 53, 69, 0.3), rgba(220, 53, 69, 0.8))", // danger
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div className="score my-2">{user.quizScore}</div>
                  <div className="score mb-4">
                    <span className="text-mute">#</span>
                    {i === 0 ? 2 : i === 1 ? 1 : 3}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="list-group">
          {data.length === 0 && (
            <div className="list-group-item leader-item text-center">
              Belum ada data.
            </div>
          )}

          {data.map((user, i) => (
            <div
              key={user._id || i}
              className={`${
                i <= 2 && "d-md-none"
              } list-group-item ${i === 0 ? "text-black" : ""} leader-item d-flex align-items-center justify-content-between mb-2`}
              style={{
                background:
                  i === 0
                    ? "linear-gradient(to bottom, rgba(255, 193, 7, 1), rgba(255, 193, 7, 1)" // warning
                    : i === 1
                      ? "linear-gradient(to bottom, rgba(13, 110, 253, 1), rgba(13, 110, 253, 1))" // info
                      : i === 2
                        ? "linear-gradient(to bottom, rgba(220, 53, 69, 1), rgba(220, 53, 69, 1))" // danger
                        : "", // primary
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="rank-circle d-flex align-items-center justify-content-center">
                  {i + 1}
                </div>

                <div>
                  <div className="fw-semibold">{user.username}</div>
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
