import { goingModel, mainModel } from "@/models/post";
import { Model } from "mongoose";
import axios from "axios";
import dbConnect from "@/utils/mongoose";
import { v4 as uuidv4 } from "uuid";
import { parse } from "path";

await dbConnect();

export default class rejangpedia {
  static instance: rejangpedia;

  //ini model datanya
  data: Model<Data>;
  ongoingData: Model<Data>;

  constructor() {
    this.data = mainModel;
    this.ongoingData = goingModel;
  }

  static getInstance(): rejangpedia {
    if (!rejangpedia.instance) rejangpedia.instance = new rejangpedia(); //bikin instance baru
    return rejangpedia.instance;
  }

  async getRecomendation() {
    const recommendation = await this.data.aggregate([
      {
        $match: {
          $or: [
            { Title: { $regex: "rejang", $options: "i" } },
            { Title: { $regex: "bengkulu", $options: "i" } },
          ],
        },
      },
      {
        $sample: { size: 3 }, // Mengambil 5 dokumen secara acak
      },
    ]);

    return recommendation;
  }

  async getDetails(id: string | string[], onGoing: boolean) {
    let mahiru;

    if (onGoing) {
      mahiru = await this.ongoingData.findOne({ id: id }).exec();
    } else {
      mahiru = await this.data.findOne({ id: id }).exec();
    }
    //cek dulu data nya null or tidak
    if (!mahiru) return { data: "Data Not Found" };

    return { data: mahiru };
  }

  async search(searchTerm: string, page: number = 1, limit: number = 10) {
    let combinedResults = []; // Inisialisasi atau reset nilai ke array kosong setiap kali metode dipanggil

    // 1. Mencari di data lokal (menggunakan skip dan limit untuk pagination)
    const skip = (page - 1) * limit;
    const localDataResults = await this.data
      .find({ Title: { $regex: searchTerm, $options: "i" } })
      .skip(skip) // Skip untuk pagination
      .limit(limit) // Batas hasil berdasarkan limit
      .slice("Content", 1) // Mengambil hanya bab pertama dari array Content
      .exec();

    combinedResults = [...localDataResults];
    if (page === 1) {
      // 2. Mencari di Wikipedia
      const wikipediaResults = await this.searchWikipedia(searchTerm);

      // 3. Menggabungkan hasil dari kedua sumber tanpa duplikasi
      if (wikipediaResults) {
        wikipediaResults.forEach((wikipediaItem: Data) => {
          const isDuplicate = localDataResults.some(
            (localItem) => localItem.id === wikipediaItem.id,
          );

          //@ts-ignore
          if (!isDuplicate) combinedResults.push(wikipediaItem);
        });
      }
    }

    return combinedResults;
  }

  async ongoing(page: number = 1, limit: number = 10) {
    let combinedResults = []; // Inisialisasi atau reset nilai ke array kosong setiap kali metode dipanggil

    // 1. Mencari di data lokal (menggunakan skip dan limit untuk pagination)
    const skip = (page - 1) * limit;
    const localDataResults = await this.ongoingData
      .find({})
      .skip(skip) // Skip untuk pagination
      .limit(limit) // Batas hasil berdasarkan limit
      .slice("Content", 1) // Mengambil hanya bab pertama dari array Content
      .exec();

    return localDataResults;
  }

  async postList(page: number = 1, limit: number = 10) {
    let combinedResults = []; // Inisialisasi atau reset nilai ke array kosong setiap kali metode dipanggil

    // 1. Mencari di data lokal (menggunakan skip dan limit untuk pagination)
    const skip = (page - 1) * limit;
    const localDataResults = await this.data
      .find({})
      .skip(skip) // Skip untuk pagination
      .limit(limit) // Batas hasil berdasarkan limit
      .slice("Content", 1) // Mengambil hanya bab pertama dari array Content
      .exec();

    return localDataResults;
  }

  async searchWikipedia(searchTerm: string) {
    // Mengecek apakah data sudah ada berdasarkan judul
    let existingData: any = [];
    // Perbaiki dengan query yang sesuai:
    existingData = await this.data.find({ Title: searchTerm }).exec();
    if (existingData) {
      return; // Mengembalikan data yang sudah ada dalam bentuk array jika ditemukan
    }

    const apiUrl = `https://id.wikipedia.org/w/api.php?action=query&format=json&titles=${searchTerm}&prop=extracts|pageimages&exintro=true&pithumbsize=300`;

    const response = await axios.get(apiUrl);
    const pageId = Object.keys(response.data.query.pages)[0];
    const title = response.data.query.pages[pageId].title;
    const content = response.data.query.pages[pageId].extract;

    // Ambil informasi gambar jika tersedia
    let imageUrl = "";
    if (response.data.query.pages[pageId].original) {
      imageUrl = response.data.query.pages[pageId].original.source;
    } else if (response.data.query.pages[pageId].thumbnail) {
      imageUrl = response.data.query.pages[pageId].thumbnail.source;
    }

    // Menambahkan data baru ke this.data
    const newData: Data = {
      id: title,
      Title: title,
      Image: imageUrl,
      Pembuat: "",
      Diedit: "",
      Link: "",
      Waktu: "",
      Edit: "",
      Content: [
        {
          babTitle: "", // You might want to set babTitle appropriately or fetch it from the API
          babContent: content,
        },
      ],
    };
    if (newData) {
      const isDataExists = await this.data.findOne({ id: newData.id });

      if (!isDataExists) {
        await this.data.create(newData);
        return [newData]; // Mengembalikan data baru dalam bentuk array
      }
    }
  }

  async delete(id: string | string[], ongoing: boolean) {
    if (ongoing) {
      await this.ongoingData.deleteOne({ id: id });
    } else {
      await this.data.deleteOne({ id: id });
    }
  }

  async edit(data: any) {
    const acceptedData = await this.data.findOne({ id: data.id });
    if (!acceptedData) {
      return null;
    }

    const tanggalSekarang = new Date();
    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const tanggal = tanggalSekarang.getDate();
    const bulan = namaBulan[tanggalSekarang.getMonth()];
    const tahun = tanggalSekarang.getFullYear();
    const formatWaktu = `${tanggal}-${bulan}-${tahun}`;

    const updatedData = {
      id: data.id,
      Title: data.Title,
      Pembuat: acceptedData.Pembuat,
      Image: data.Image
        ? `${process.env.urlEndpoint}RejangPedia/image-${data.id}.jpg`
        : acceptedData.Image,
      Diedit: data.Diedit,
      Link: data.Link.replace("/watch?v=", "/embed/"),
      Waktu: acceptedData.Waktu || "Tidak Diketahui",
      Edit: formatWaktu,
      Content: data.Content,
    };

    await this.ongoingData.updateOne(
      { id: data.id },
      { $set: updatedData },
      { upsert: true },
    );

    // Kirim notifikasi ke Discord
    await this.sendDiscordNotification("Artikel Diedit", data.Title, data.id);

    return updatedData;
  }

  async create(body: Data) {
    const uniqueFileName = uuidv4();
    const tanggalSekarang = new Date();

    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const tanggal = tanggalSekarang.getDate();
    const bulan = namaBulan[tanggalSekarang.getMonth()];
    const tahun = tanggalSekarang.getFullYear();
    const currentEpochTime = Date.now();

    await this.ongoingData.create({
      id: uniqueFileName,
      Title: body.Title,
      Image: `${process.env.urlEndpoint}RejangPedia/image-${uniqueFileName}.jpg?updatedAt=${currentEpochTime}`,
      Pembuat: body.Pembuat,
      Link: body.Link.replace("/watch?v=", "/embed/"),
      Edit: `${tanggal}-${bulan}-${tahun}`,
      Waktu: `${tanggal}-${bulan}-${tahun}`,
      Content: body.Content,
    });

    // Kirim notifikasi ke Discord
    await this.sendDiscordNotification(
      "Artikel Baru Ditambahkan",
      body.Title,
      uniqueFileName,
    );

    return {
      id: uniqueFileName,
      Title: body.Title,
      Image: `${process.env.urlEndpoint}RejangPedia/image-${uniqueFileName}.jpg`,
      Pembuat: body.Pembuat,
      Link: body.Link.replace("/watch?v=", "/embed/"),
      Edit: `${tanggal}-${bulan}-${tahun}`,
      Waktu: `${tanggal}-${bulan}-${tahun}`,
      Content: body.Content,
    };
  }

  async accept(id: string | string[]) {
    const acceptedData = await this.ongoingData.findOne({ id: id });
    if (!acceptedData) {
      return;
    }
    try {
      // Hapus data dari goingModel
      await this.ongoingData.deleteOne({ id: id });
      // Cek apakah data sudah ada di mainModel
      const existingData = await this.data.findOne({ id: id });

      if (existingData) {
        // Update data yang sudah ada
        await this.data.findOneAndUpdate({ id: id }, acceptedData);
      } else {
        // Tambahkan data baru
        await this.data.create({
          id: acceptedData.id,
          Title: acceptedData.Title,
          Pembuat: acceptedData.Pembuat,
          Image: acceptedData.Image,
          Diedit: "",
          Link: acceptedData.Link,
          Edit: acceptedData.Edit,
          Waktu: acceptedData.Waktu,
          Content: acceptedData.Content,
        });
      }
    } catch (error) {
      console.error("Error accepting data:", error);
    }
  }
  async sendDiscordNotification(action: string, title: string, id: string) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL; // Simpan di .env
    const roleId = "1355742371039678555"; // Ganti dengan ID role yang ingin di-mention
    const rejangpediaUrl = `https://rejangpedia.vercel.app/post/ongoing/${id}`; // Ganti dengan URL asli
    const waktuSekarang = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    if (!webhookUrl) {
      console.error("Webhook URL tidak ditemukan.");
      return;
    }

    const embedData = {
      content: `<@&${roleId}> 📌 **${action}**`, // Mention role
      embeds: [
        {
          title: `📖 ${title}`,
          url: rejangpediaUrl, // Link ke halaman artikel
          description: `🔹 **Aksi:** ${action}\n🔹 **Tanggal:** ${waktuSekarang}`,
          color: 0x2ecc71, // Warna hijau terang 🌿
          footer: {
            text: "Rejangpedia",
          },
        },
      ],
    };

    try {
      await axios.post(webhookUrl, embedData);
    } catch (err) {
      console.error("Gagal mengirim notifikasi ke Discord:", err);
    }
  }
}
