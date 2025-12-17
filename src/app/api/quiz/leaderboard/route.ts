import { NextResponse } from "next/server";
import Users from "@/controllers/user";

export async function GET() {
  try {
    const leaderboard = await Users.getInstances().getLeaderboard(20);

    return NextResponse.json({ leaderboard });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
