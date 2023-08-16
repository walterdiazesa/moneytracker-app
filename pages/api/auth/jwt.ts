import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "GET") throw new Error(`Invalid Method "${req.method}"`);
  const token = await getToken({ req, raw: true });
  (res as any).json({ token });
}
