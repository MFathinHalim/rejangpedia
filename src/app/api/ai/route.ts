import { NextRequest } from "next/server";
import { chatCompletionsLlamaKolosal } from "@/lib/ai"; // sesuaikan path

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt") || "topik tidak disebutkan";

  const system = `
Kamu adalah asisten edukasi.
Jelaskan secara SUPER LENGKAP, terstruktur, dan mudah dipahami.
Gunakan rich text (HTML).
Highlight 1 kalimat pengertian utama menggunakan:
- background-color: #245292
- color: white
JANGAN GUNAKAN CSS LAINNYA SELAIN 2 INI
JANGAN gunakan kalimat pembuka seperti "baiklah", "tentu", dll.
Langsung ke isi.
`;

  const userPrompt = `Jelaskan tentang ${prompt}`;

  try {
    const result = await chatCompletionsLlamaKolosal(userPrompt, system);
    return new Response(
      JSON.stringify({
        success: true,
        answer: result,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("AI ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Gagal memproses AI",
      }),
      { status: 500 },
    );
  }
}
