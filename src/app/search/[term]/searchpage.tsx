"use client";
import PostShortcut from "@/components/PostShortcut";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { marked } from "marked";

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
  const [speaking, setSpeaking] = useState(false);
  const params = useParams();
  const searchTerm: string | any = params.term;
  const truncateMarkdown = (markdown: string, limit: number): string => {
    //@ts-ignore
    const plainText = marked.parse(markdown || "").replace(/<[^>]*>/g, "");
    return plainText.length > limit && limit > 0
      ? plainText.substring(0, limit) + "..."
      : plainText;
  };
  const [indoVoice, setIndoVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const idVoice =
        voices.find((v) => v.lang === "id-ID") ||
        voices.find((v) => v.lang.startsWith("id"));

      setIndoVoice(idVoice || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
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
  const handleSpeak = () => {
    if (!messages) return;

    const synth = window.speechSynthesis;
    synth.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      truncateMarkdown(messages, 0),
    );
    utterance.lang = "id-ID";
    utterance.voice = indoVoice;
    speechSynthesis.getVoices().forEach((v) => console.log(v.name, v.lang));
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);

    synth.speak(utterance);
  };

  return (
    <div className="container" id="container">
      <div className="px-3 pb-3">
        <h3>Dinda Menjawab</h3>
        <div className="d-flex align-items-start gap-3">
          <img
            src="/happy.gif"
            alt="AI Avatar"
            className={`shadow-sm flex-shrink-0 ai-avatar ${speaking ? "rounded" : "rounded-circle"}`}
            style={{
              width: speaking ? "140px" : "101px",
              height: speaking ? "140px" : "101px",
              objectFit: "cover",
              cursor: "pointer",
              transition: "all 0.25s ease",
              transform: speaking ? "scale(1.05)" : "scale(1)",
            }}
            onClick={handleSpeak}
          />

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
                className="btn btn-sm btn-outline-primary"
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
              key={index}
              className="listing-image rounded my-2"
              style={{
                width: "100%",
                height: "150px",
                backgroundColor: `${index % 2 === 0 ? "var(--primary)" : "var(--secondary)"}`,
                borderRadius: "10px",
              }}
            ></div>
          ))
        )}
        {loading &&
          [...Array(3)].map((_, index) => (
            <div
              key={index}
              className="listing-image rounded my-2"
              style={{
                width: "100%",
                height: "150px",
                backgroundColor: `${index % 2 === 0 ? "var(--primary)" : "var(--secondary)"}`,
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
