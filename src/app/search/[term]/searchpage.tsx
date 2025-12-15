"use client";
import PostShortcut from "@/components/PostShortcut";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { marked } from "marked";
import { Bot } from "lucide-react";

interface Data {
  _id: string;
  title: string;
  content: string;
}

export default function SearchPage() {
  const [posts, setPosts] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [messages, setMessages] = useState<string>("");
  const [showFullMessage, setShowFullMessage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const params = useParams();
  const searchTerm: string | any = params.term;

  useEffect(() => {
    async function fetchData() {
      try {
        const apiurl = `/api/ai?prompt=${encodeURIComponent(searchTerm || "")}`;
        const response = await fetch(apiurl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const newMessages = data.answer;
        setMessages(newMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (searchTerm) fetchData();
  }, [searchTerm]);

  async function fetchPosts(page: number) {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      console.log(`Fetching page ${page} for searchTerm: ${searchTerm}`);
      const response = await fetch(
        `/api/post/search/${searchTerm}?page=${page}`,
      );
      if (!response.ok) throw new Error("Error fetching posts");

      const data = await response.json();
      if (data.data.length > 0) {
        setPosts((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
        setCurrentPage(page);
      } else {
        console.log("No more posts available");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);
    if (searchTerm) fetchPosts(1);
  }, [searchTerm]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchPosts(currentPage + 1);
    }
  }, [inView]);

  const truncateMarkdown = (markdown: string, limit: number): string => {
    //@ts-ignore
    const plainText = marked.parse(markdown).replace(/<[^>]*>/g, ""); // Menghapus tag HTML
    return plainText.length > limit
      ? plainText.substring(0, limit) + "..."
      : plainText;
  };

  return (
    <div className="container" id="container">
      <div className="px-3 pb-3">
        <h3>
          <Bot /> Ai Overview
        </h3>
        <div className="d-block d-md-flex">
          <div>
            <p
              dangerouslySetInnerHTML={{
                __html:
                  marked.parse(
                    showFullMessage
                      ? messages
                      : truncateMarkdown(messages, 350),
                  ) || "Sedang Berpikir...",
              }}
            />
            {messages && (
              <button
                className="btn btn-primary"
                onClick={() => setShowFullMessage((prev) => !prev)}
              >
                {showFullMessage ? "Sembunyikan" : "Baca Rangkuman"}
              </button>
            )}
          </div>
        </div>
        <hr className={`mb-4 ${messages ? "mt-4" : "mt-0"}`} />
        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <div key={post._id}>
                <PostShortcut post={post} />
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          [...Array(3)].map((_, index) => (
            <div
              key={index} // Tambahkan key untuk setiap elemen yang di-loop
              className="listing-image rounded my-2"
              style={{
                width: "100%",
                height: "150px",
                backgroundColor: `${index % 2 === 0 ? "var(--primary)" : "var(--secondary)"}`, // warna abu-abu
                borderRadius: "10px",
              }}
            ></div>
          ))
        )}
        {loading &&
          [...Array(3)].map((_, index) => (
            <div
              key={index} // Tambahkan key untuk setiap elemen yang di-loop
              className="listing-image rounded my-2"
              style={{
                width: "100%",
                height: "150px",
                backgroundColor: `${index % 2 === 0 ? "var(--primary)" : "var(--secondary)"}`, // warna abu-abu
                borderRadius: "10px",
              }}
            ></div>
          ))}
      </div>
      {hasMore && (
        <div ref={ref} style={{ height: "10px", background: "transparent" }} />
      )}
    </div>
  );
}
