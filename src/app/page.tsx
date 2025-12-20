"use client";
import {
  Smartphone,
  Laptop,
  Tablet,
  Bot,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRef, useState } from "react";
import { marked } from "marked";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <main>
      <audio
        ref={audioRef}
        src="/LEMADAT.mp3"
        loop
        preload="auto"
        style={{ display: "none" }}
      />
      <button
        onClick={toggleAudio}
        className="btn btn-dark rounded-circle position-fixed d-flex align-items-center justify-content-center"
        style={{
          bottom: "24px",
          left: "24px",
          width: "56px",
          height: "56px",
          zIndex: 9999,
          opacity: 0.85,
        }}
        aria-label="Toggle Musik Rejang"
      >
        {isPlaying ? <Volume2 /> : <VolumeX />}
      </button>
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-5 hero-blur">
        <div className="d-flex justify-content-center mb-4">
          <img
            src="/logo-icon.png"
            alt="Rejangpedia Logo"
            width={100}
            height={100}
          />
        </div>
        {/* Hero Text */}
        <section className="text-center mb-4 text-white">
          <h1 className="fw-bold display-6 mb-3">
            Ruang Temu Tradisi dan Inovasi
            <br />
            Smart Culture Digital Legacy
          </h1>
          <small>With Dinda Menjawab</small>
          <p className="display-6 py-3" id="bangkahulu" lang="rejang">
            cir ap id is in
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <a className="btn btn-primary btn-lg mt-3" href="/home">
              GAS CUBO
            </a>
            <a
              className="btn btn-secondary btn-lg mt-3"
              href="https://kamusrejang.vercel.app"
            >
              KAMUS REJANG
            </a>
          </div>
        </section>
        {/* Image Placeholder Row*/}
        <div className="row justify-content-center align-items-end g-4 mt-3 px-3">
          <div className="col-6 d-none d-md-block col-md-2 d-flex justify-content-center">
            <img
              src="https://ik.imagekit.io/9hpbqscxd/RejangPedia/image-3c3d5ac0-70a6-11ee-acd8-7d4adb250123.jpg"
              className="rounded-4"
              style={{
                width: "240px",
                objectFit: "cover",
                height: "280px",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
          <div className="col-12 col-md-2 d-flex justify-content-center">
            <img
              src="https://ik.imagekit.io/9hpbqscxd/RejangPedia/image-962de910-70a5-11ee-acd8-7d4adb250123.jpg"
              className="rounded-4"
              style={{
                width: "240px",
                height: "260px",
                objectFit: "cover",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
          <div className="col-6 col-md-2 d-none d-md-block d-flex justify-content-center">
            <img
              src="https://ik.imagekit.io/9hpbqscxd/RejangPedia/image-77ae6130-709c-11ee-acd8-7d4adb250123.jpg"
              className="rounded-4"
              style={{
                width: "240px",
                objectFit: "cover",
                height: "200px",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
          <div className="d-none col-md-2 d-md-flex justify-content-center">
            <img
              src="https://ik.imagekit.io/9hpbqscxd/RejangPedia/image-954971f0-70a4-11ee-acd8-7d4adb250123.jpg"
              className="rounded-4"
              style={{
                objectFit: "cover",
                width: "240px",
                height: "260px",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
          <div className="d-none d-md-block col-6 col-md-2 d-flex justify-content-center">
            <img
              src="https://ik.imagekit.io/9hpbqscxd/RejangPedia/image-9b89fe80-af84-11ee-99b3-e12561f5f811.jpg"
              className="rounded-4"
              style={{
                objectFit: "cover",
                width: "240px",
                height: "280px",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="px-3 mt-5">
          <h2 className="fw-bold mb-3 display-4 text-primar">Dinda Menjawab</h2>{" "}
          <div className="d-flex align-items-start gap-3">
            <img
              src="/happy.gif"
              alt="AI Avatar"
              className="shadow-sm flex-shrink-0 ai-avatar rounded-circle"
              style={{
                width: "101px",
                height: "101px",
                objectFit: "cover",
                cursor: "pointer",
                transition: "all 0.25s ease",
                transform: "scale(1)",
              }}
            />

            <div>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    "Rejang adalah salah satu suku bangsa yang berasal dari Provinsi Bengkulu, Indonesia. Suku Rejang merupakan suku asli yang mendiami wilayah Provinsi Bengkulu, terutama di daerah Rejang Lebong, Lebong, dan Kepahiang. Berikut adalah beberapa aspek yang terkait dengan suku Rejang: Asal Usul: Suku Rejang diyakini telah mendiami wilayah Bengkulu sejak lama...",
                }}
              />

              <a
                href="/search/rejang"
                className="btn btn-sm btn-outline-primary"
              >
                Baca Selengkapnya
              </a>
            </div>
          </div>
        </div>
        <hr className={`mt-4`} />

        <section className="py-5 mb-5">
          <div className="d-flex flex-column-reverse gap-3 flex-md-row justify-content-between align-items-center">
            <div className="col-md-6">
              <h2 className="fw-bold mb-3 display-4 text-sec">rejangpedia</h2>

              <p className="fs-5">
                sebuah platform all-in-one dengan semangat gotong royong, yang
                bertujuan untuk melestarikan warisan budaya Bengkulu secara
                umum, dan khususnya Rejang Lebong dalam format literasi digital
              </p>
            </div>
            <img
              src="/logo-icon.png"
              alt="Rejangpedia Logo"
              className="rounded-4"
              style={{
                width: "200px",
                height: "200px",
              }}
            />
          </div>
        </section>
        <section className="py-5 my-5">
          <div className="d-flex flex-column-reverse gap-3 flex-md-row-reverse justify-content-between align-items-center">
            <div className="col-md-6 text-end">
              <h2 className="fw-bold mb-3 display-4 text-primar">
                cari artikel gampang
              </h2>

              <p className="fs-5">
                rejangpedia menyediakan beragam artikel tentang budaya Rejang
                yang selama ini banyak diwariskan secara lisan. Melalui platform
                ini, kami mengajak Anda untuk ikut membagikan pengetahuan,
                cerita, dan berbagai hal lain seputar Rejang agar budaya tetap
                hidup dan dikenal luas.
              </p>
            </div>
            <img
              src="/hook1.png"
              alt="Rejangpedia Logo"
              className="rounded-4"
              style={{
                width: "400px",
                objectFit: "cover",
                height: "300px",
              }}
            />
          </div>
        </section>
        <div className="culture-banner d-flex align-items-center">
          <div className="banner-content text-white text-center vw-100">
            <h2 className="fw-bold mb-2">Lestarikan Budaya Lewat Teknologi</h2>
            <p className="mb-0">supaya gak kalah sama asing, hehe</p>
          </div>
        </div>
        <section className="py-5 my-5">
          <div className="d-flex flex-column-reverse gap-3 flex-md-row justify-content-between align-items-center">
            <div className="col-md-6">
              <h2 className="fw-bold mb-3 display-4 text-primar">
                Latih Kemampuanmu!
              </h2>

              <p className="fs-5">
                Kerjain Quiz seputar Rejang, Bengkulu, Umum DAN Raih Posisi
                Tertinggi di Leaderboard!
              </p>
            </div>
            <img
              src="/happy.gif"
              alt="Rejangpedia Logo"
              className="rounded-4"
              style={{
                width: "200px",
                height: "200px",
              }}
            />
          </div>
        </section>
      </div>
      <div className="hero-blur2">
        <section className="py-5 my-5 row align-items-center justify-content-center text-white">
          <p className="mb-3 text-center h3 fw-light col-md-6">
            <img
              src="/happy.gif"
              width={70}
              height={70}
              className="mb-2 rounded-circle"
            />
            <br />
            <span className="fw-bold">Dinda</span> membantu Anda memahami inti
            artikel budaya Rejang dengan cepat dan mudah. Teknologi AI merangkum
            poin-poin penting dari setiap artikel sehingga pembaca dapat
            menangkap makna utama tanpa harus membaca keseluruhan isi,
            menjadikan pembelajaran budaya lebih efisien dan ramah untuk semua
            kalangan.
          </p>
        </section>
      </div>
      <section className="py-5 my-5 row align-items-center justify-content-center w-100">
        <div className="text-center">
          <div className="d-flex align-items-center justify-content-center mb-3 gap-3 w-100">
            <Smartphone size={50} />
            <Tablet size={50} />
            <Laptop size={50} />
          </div>
          <h1 className="mb-4 fw-bold">
            Belajar Kapan Saja,
            <br /> Di Mana Saja
          </h1>

          <div className="d-flex flex-column-reverse justify-content-center align-items-center gap-4 flex-wrap">
            <a
              href="https://play.google.com/store/apps/details?id=com.domatomoharu.rejangpedia&hl=id"
              className="btn btn-dark d-flex align-items-center gap-2 px-4 py-2"
            >
              <Play /> Get On Google Play
            </a>
          </div>
        </div>
      </section>
      <footer className="border-sec-top border-primar py-5 px-md-5 mt-5">
        <div className="d-flex flex-row justify-content-center g-4">
          {/* Brand */}
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src="/logo-icon.png"
                width={32}
                height={32}
                alt="Rejangpedia"
              />
              <h5 className="mb-0 fw-bold">Rejangpedia</h5>
            </div>
            <p className=" small">
              Platform budaya Rejang berbasis teknologi untuk belajar, berbagi,
              dan menjaga warisan lokal tetap hidup di era digital.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center  small mt-5">
          © {new Date().getFullYear()} Rejangpedia. Dibangun dengan teknologi &
          kepedulian budaya.
        </div>
      </footer>
    </main>
  );
}
