"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Link {
  shortcode: string,
  targeturl: string,
  totalclicks: number,
  lastclickedtime: Date | null,
}


export default function LinksDashboard() {
  const [links, setLinks] = useState<Link[]>([]);


  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/links`)
      const rows = await response.json()
      setLinks(rows)
    })()
  }, [])

  const [newUrl, setNewUrl] = useState("");
  const [search, setSearch] = useState("");

  const filteredLinks = links.filter(
    (l) =>
      l.shortcode.toLowerCase().includes(search.toLowerCase()) ||
      l.targeturl.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newUrl) return;
    
    try {
      new URL(newUrl);
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const response = await fetch(`/api/links`, {
      method: "POST",
      body: newUrl,
    })

    const shortcode = await response.text()

    setLinks([
      ...links,
      {
        shortcode,
        targeturl: newUrl,
        totalclicks: 0,
        lastclickedtime: null,
      },
    ]);
    setNewUrl("");
  };

  const handleDelete = async (code: string) => {
    await fetch(`/api/links/${code}`, {
      method: "DELETE",
    })
    setLinks(links.filter((l) => l.shortcode !== code));
  };

  return (
    <div className="p-4 sm:p-8 lg:p-32 min-h-screen bg-slate-50 font-sans">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900">Link Shortener Dashboard</h1>

      {/* Add New Link */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Add New Link</h2>
        <div className="flex flex-wrap gap-4">
          <input
            placeholder="Target URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-lg flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 text-slate-900"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add Link
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="Search by code or URL"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-3 border border-slate-300 rounded-lg mb-5 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 text-slate-900"
      />

      {/* Table */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-2 sm:p-4 text-left font-semibold">Short Code</th>
              <th className="p-2 sm:p-4 text-left font-semibold hidden sm:table-cell">Shortened URL</th>
              <th className="p-2 sm:p-4 text-left font-semibold">Target URL</th>
              <th className="p-2 sm:p-4 text-left font-semibold">Clicks</th>
              <th className="p-2 sm:p-4 text-left font-semibold hidden lg:table-cell">Last Clicked</th>
              <th className="p-2 sm:p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link) => (
              <tr key={link.shortcode} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-2 sm:p-4">
                  <Link href={`/code/${link.shortcode}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {link.shortcode}
                  </Link>
                </td>
                <td className="p-2 sm:p-4 max-w-xs truncate text-slate-700 hidden sm:table-cell">
                  <Link href={`${window.origin}/${link.shortcode}`} target="_blank" className="text-blue-600 hover:text-blue-800 font-medium">
                    {`${window.origin}/${link.shortcode}`}
                  </Link>
                </td>
                <td className="p-2 sm:p-4 max-w-xs truncate text-slate-700">{link.targeturl}</td>
                <td className="p-2 sm:p-4 text-slate-700">{link.totalclicks}</td>
                <td className="p-2 sm:p-4 text-slate-700 hidden lg:table-cell">{link.lastclickedtime ? link.lastclickedtime.toLocaleString() : "-"}</td>
                <td className="p-2 sm:p-4">
                  <button
                    onClick={() => handleDelete(link.shortcode)}
                    className="px-2 sm:px-3 py-1 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
