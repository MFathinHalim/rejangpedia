//Todo list:
/*
    [DONE] Make Login and Sign Up and accessToken. Details Account and Bookmark.
    *(welp, you can use the Texter for this one lol 0w0)*
*/
//Good Luck :)
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
////////////////////////////////////////////
import type { Model } from "mongoose";
import { userModel } from "@/models/user";
import type { Document } from "mongoose";
///////////////////////////////////////////
import dbConnect from "@/utils/mongoose";
import { NextRequest } from "next/server";
await dbConnect();

dotenv.config();

// declare module "jsonwebtoken" {
//     interface JwtPayload {
//         id: string
//     }
// }

class Users {
  static instances: Users;

  #users: Model<userType>;
  #error: userType[];

  constructor() {
    this.#users = userModel;
    this.#error = [
      {
        username: "system",
        desc: "system",
        password: "system",
        accessToken: {
          accessNow: "",
          timeBefore: "",
        },
      },
      {
        username: "system",
        desc: "system",
        password: "system",
        accessToken: {
          accessNow: "",
          timeBefore: "",
        },
      },
    ]; //list kemungkinan error
  }

  static getInstances() {
    if (!Users.instances) Users.instances = new Users(); //Untuk ngestart class
    return Users.instances;
  }

  async getLeaderboard(limit: number = 10) {
    try {
      // ambil top users berdasar score
      const topUsers = await this.#users
        .find({})
        .sort({ quizScore: -1 }) // descending
        .limit(limit)
        .lean();

      // hapus password
      return topUsers.map((u) => ({
        username: u.username,
        quizScore: u.quizScore || 0,
      }));
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      return [];
    }
  }

  async signUp(
    name: string = "",
    username: string = "",
    password: string = "",
    desc: string,
  ): Promise<userType> {
    password = await bcrypt.hash(btoa(password), 10); //bikin crypt buat passwordnya (biar gak diliat cihuyyy)
    const MAX_USERNAME_LENGTH = 16;

    // Regular expression to detect non-printable characters including Zero Width Space and other control characters
    const hasInvalidCharacters = /[\u200B-\u200D\uFEFF]/.test(username);

    // Regular expression to detect HTML tags
    const hasHTMLTags = /<\/?[a-z][\s\S]*>/i.test(username);

    // Check for invalid username
    if (
      username.length === 0 ||
      hasInvalidCharacters ||
      hasHTMLTags ||
      username.length > MAX_USERNAME_LENGTH ||
      name.length > MAX_USERNAME_LENGTH ||
      username.includes("/")
    ) {
      return this.#error[0]; // Handle username errors
    }
    //untuk signup
    const isNameTaken = await this.#users.findOne({
      $or: [{ username: username }],
    }); //? Check dulu apakah usernamenyna udah ada atau belum
    if (isNameTaken) return this.#error[0];
    ////////////////////////////////////////////////
    const newUser: userType = {
      username: username.replace(/<[^>]+>/g, ""), //! )====> Bikin supaya gak nambahin html <></> dan kawan kawan<(0O0)/
      desc: "", //! )
      atmin: false,
      password: password,
    };

    await this.#users.create(newUser); //di push

    return newUser; //di return
  }

  async login(username: string, password: string): Promise<userType> {
    //Login
    try {
      const user = await this.#users.findOne({
        username: username,
      });
      if (!user) {
        return this.#error[1]; // User not found or banned
      }

      const isPasswordValid = await bcrypt.compare(
        btoa(password),
        user.password || "",
      ); //? check apakah passwordnya sesuai
      if (!isPasswordValid) return this.#error[1]; // Invalid password

      return user;
    } catch (error) {
      console.error("Error during login:", error);
      return this.#error[1]; // Handle potential errors during database query
    }
  }

  async createAccessToken(
    id: string,
  ): Promise<{ newToken: string; refreshToken: string }> {
    try {
      const user = await this.#users.findOne({ _id: id });
      if (!user) return { newToken: "", refreshToken: "" };
      const { desc, ...userPayload } = user.toObject();

      const newToken: string = jwt.sign(
        userPayload,
        process.env.JWT_SECRET_KEY || "",
        { expiresIn: "1d" },
      ); // Buat access token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "7d",
        },
      );
      return { newToken, refreshToken };
    } catch (error) {
      console.error("Error creating access token:", error);
      return { newToken: "", refreshToken: "" };
    }
  }

  createRefreshToken(refresh: string): any {
    return jwt.verify(
      refresh,
      process.env.JWT_SECRET_KEY || "",
      async (err: any, user: any) => {
        if (err) return "error";
        console.log(user);
        const createAccessTokenn = await this.createAccessToken(user.id);
        const accessToken: string = createAccessTokenn.newToken;

        return accessToken;
      },
    );
  }

  checkAccessToken(token: string) {
    let jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";
    try {
      return jwt.verify(token, jwtSecretKey); //Check access token jwtnya sesuai atau kagak (?)
    } catch (error) {
      return this.#error[0];
    }
  }
  async getUserByUsername(username: string | string[]) {
    try {
      // Cari user berdasarkan username
      const user = await this.#users.findOne({ username: username });
      // Jika user tidak ditemukan, kembalikan error
      if (!user) {
        return this.#error[1];
      }

      // Menghilangkan password dari data pengguna yang dikembalikan
      const userWithoutPassword = {
        _id: user._id,
        id: user.id,
        username: user.username,
        desc: user.desc,
      };

      return userWithoutPassword;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return this.#error[1];
    }
  }
  async checkUserDetails(username: string) {
    const user: (Document<userType, any, any> & userType) | null =
      await this.#users.findOne({ username: username });
    const userWithoutPassword = {
      ...user?.toObject(),
      password: undefined,
    }; //check user detail (gak ngasihi password)

    if (user) {
      return {
        user: userWithoutPassword,
      };
    }
    return {
      user: this.#error[1],
    };
  }

  async checkUserId(
    userId: string,
  ): Promise<(Document<userType, any, any> & userType) | userType> {
    const user: (Document<userType, any, any> & userType) | null =
      await this.#users.findOne({ id: userId });
    if (user) {
      return user;
    } else {
      return this.#error[1];
    }
  } //cari usernya berdasarkan id

  async checkUserUname(
    username: string,
  ): Promise<(Document<userType, any, any> & userType) | userType> {
    const user: (Document<userType, any, any> & userType) | null =
      await this.#users.findOne({ username: username }); //cari berdasarkan username
    if (user) {
      return user;
    } else {
      return this.#error[1];
    }
  }

  async editProfile(userData: userType): Promise<userType | {}> {
    try {
      const user = await this.#users.findOne({ id: userData.id });
      const hasInvalidCharacters = /[\u200B-\u200D\uFEFF]/.test(
        userData.username,
      );

      // Regular expression to detect HTML tags
      const hasHTMLTags = /<\/?[a-z][\s\S]*>/i.test(userData.username);

      // Maximum length for Discord username
      const MAX_DISCORD_USERNAME_LENGTH = 16;

      // Check for invalid fields
      if (
        userData.username.trim().length === 0 ||
        hasInvalidCharacters ||
        hasHTMLTags ||
        userData.username.trim().length > MAX_DISCORD_USERNAME_LENGTH
      ) {
        return this.#error[0];
      }
      if (!user) {
        return this.#error[1]; // User not found
      }

      user.desc = userData.desc;

      await user.save();
      return {
        username: user.username.replace(/<[^>]+>/g, ""),
        desc: user.desc!.replace(/<[^>]+>/g, ""),
      };
    } catch (error) {
      console.error("Error editing profile:", error);
      return this.#error[1];
    }
  }
  async authRequest(req: NextRequest) {
    try {
      const token = req.headers.get("authorization")?.split(" ")[1];
      if (!token) return null;
      const result = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
      if (!result || typeof result === "string") return null;

      let user = await userModel.findOne({ _id: result._id }).lean();
      if (!user) return null;

      user.accessToken = {
        accessNow: "",
        timeBefore: "",
      };
      user.password = "";

      return user;
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }
  async recrutAdmin(id: string | string[]) {
    const foundUser = await this.#users.findOne({ id: id });
    if (foundUser) {
      // If the user is found, set the 'atmin' property to true
      if (!foundUser.atmin) {
        await this.#users.updateOne(
          { _id: foundUser._id },
          { $set: { atmin: true } },
        );
      } else {
        await this.#users.updateOne(
          { _id: foundUser._id },
          { $set: { atmin: false } },
        );
      }
    }
  }
  async checkAdmin(id: string): Promise<boolean> {
    try {
      const user = await this.#users.findOne({ _id: id });
      return user?.atmin === true;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

export default Users; //TODO Export biar bisa dipake
