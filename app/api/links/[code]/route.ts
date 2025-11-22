import { dbPool } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const rows = await dbPool.query("SELECT * from urls where shortcode = $1", [
    code,
  ]);
  if (rows.length > 0) {
    return Response.json(rows[0]);
  } else {
    return Response.json({ error: "URL not found" });
  }
}


export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  await dbPool.query("DELETE from urls where shortcode = $1", [code]);
  return Response.json({ success: true });
}
