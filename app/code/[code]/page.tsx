import { dbPool } from "@/lib/db";
import { notFound } from "next/navigation";


export interface Link {
  shortcode: string,
  targeturl: string,
  totalclicks: number,
  lastclickedtime: Date | null,
}


export default async function StatsPage(
  { params }: { params: Promise<{ code: string }> }
) {

  const { code } = await params;

  const rows = await dbPool.query("SELECT * FROM urls WHERE shortcode = $1", [code])

  if (rows.length == 0) {
     notFound();
  }

  const row = rows[0] as Link;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F6FF] to-[#DEE8FF] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#1C2A4A]">Stats for "{code}"</h1>

        <div className="bg-white shadow-2xl border border-[#DCE5FF] rounded-2xl p-8 space-y-6">
          <div>
            <p className="text-sm text-[#6B7A99] mb-1">Short Code</p>
            <p className="text-lg font-semibold text-[#1C2A4A]">{row.shortcode}</p>
          </div>

          <div>
            <p className="text-sm text-[#6B7A99] mb-1">Target URL</p>
            <a
              href={row.targeturl}
              target="_blank"
              className="text-[#4A63FF] hover:text-[#3B4ED9] hover:underline break-all transition-colors"
            >
              {row.targeturl}
            </a>
          </div>

          <div>
            <p className="text-sm text-[#6B7A99] mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-[#4A63FF]">{row.totalclicks}</p>
          </div>

          <div>
            <p className="text-sm text-[#6B7A99] mb-1">Last Clicked</p>
            <p className="font-medium text-[#1C2A4A]">{row.lastclickedtime ? row.lastclickedtime.toLocaleString(): "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
