import { NextResponse } from "next/server";

// Fetch live news from Times of India RSS feed (general top stories)
export async function GET() {
  try {
    const rssUrl = "https://timesofindia.indiatimes.com/rssfeedstopstories.cms";
    const response = await fetch(rssUrl, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Adyapan/1.0)" },
    });

    if (!response.ok) {
      return NextResponse.json({ stories: [] });
    }

    const xml = await response.text();

    const items: Array<{
      title: string;
      description: string;
      link: string;
      pubDate: string;
      image?: string;
    }> = [];

    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    for (const itemXml of itemMatches.slice(0, 12)) {
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] ||
                    itemXml.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const description = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]>/)?.[1] ||
                          itemXml.match(/<description>(.*?)<\/description>/)?.[1] || "";
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const image = itemXml.match(/<media:content[^>]*url="([^"]+)"/)?.[1] ||
                    itemXml.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] || undefined;

      if (title) {
        const cleanDesc = description.replace(/<[^>]*>/g, "").trim();
        items.push({ title, description: cleanDesc, link, pubDate, image });
      }
    }

    const categories = ["Science", "AI", "Inspiring", "Space", "Coding", "Nature", "Fun Facts"];
    const sourceNames = ["News Desk", "Tech Hub", "Science Daily", "Innovation Lab", "Knowledge Base", "Discovery", "Global Pulse"];
    const sourceColors = ["bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-cyan-600", "bg-rose-600", "bg-amber-600", "bg-indigo-600"];
    const gradients = [
      "from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600",
      "from-purple-500 to-violet-600", "from-rose-500 to-pink-600",
      "from-cyan-500 to-sky-600", "from-orange-500 to-amber-600",
      "from-yellow-500 to-orange-500",
    ];
    const emojis = ["📰", "🔬", "🌟", "🚀", "💡", "🧪", "📱", "🎮", "🔧", "📐", "🛸", "🌍"];

    const stories = items.map((item, i) => ({
      id: `news-${i}`,
      source: sourceNames[i % sourceNames.length],
      sourceColor: sourceColors[i % sourceColors.length],
      sourceInitial: sourceNames[i % sourceNames.length].charAt(0),
      category: categories[i % categories.length],
      title: item.title,
      body: item.description || "Read the full article for more details.",
      readTime: `${Math.max(1, Math.ceil((item.description?.length || 100) / 500))} min`,
      comments: Math.floor(Math.random() * 80) + 10,
      emoji: emojis[i % emojis.length],
      hasImage: i < 4,
      imageBg: gradients[i % gradients.length],
      imageUrl: item.image,
      tag: i === 0 ? "#Trending" : i < 3 ? "#Popular" : undefined,
      featured: i === 0,
      link: item.link,
      pubDate: item.pubDate,
    }));

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ stories: [] });
  }
}
