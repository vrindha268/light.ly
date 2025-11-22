import { dbPool } from "@/lib/db";

function randomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  const url = await request.text();
  const shortCode = randomString(6);
  await dbPool.query(
    "INSERT INTO urls (shortcode, targeturl, totalclicks, lastclickedtime) VALUES ($1, $2, $3, $4)",
    [shortCode, url, 0, null],
  );

  return new Response(shortCode);
}


export async function GET() {
  const rows = await dbPool.query("SELECT * from urls");

  return Response.json(rows);
}
