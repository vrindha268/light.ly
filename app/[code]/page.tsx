import { dbPool } from "@/lib/db";
import { notFound, redirect } from "next/navigation";


export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const rows = await dbPool.query(
    "SELECT * FROM urls WHERE shortcode = $1",
    [code],
  );

  if (rows.length > 0) {
    const row = rows[0]
    const url = row.targeturl;
    const totalClicks = row.totalclicks + 1;
    const lastClickedTime = new Date().toISOString();
    await dbPool.query(
      "UPDATE urls SET totalclicks = $1, lastclickedtime = $2 WHERE shortcode = $3",
      [totalClicks, lastClickedTime, code],
    );
    redirect(url)
  } else {
    notFound();
  }
}
