import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' in request body." },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const pageRes = await fetch(url);
    if (!pageRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch YouTube page." },
        { status: 502 }
      );
    }

    const html = await pageRes.text();
    const truncatedHtml = html.slice(0, 48000);

    const prompt =
      "You are an assistant that extracts a clean, plain-text transcript from a YouTube video page HTML or caption data. " +
      "Given the following HTML, return only the spoken transcript as readable paragraphs (no timestamps, no markup, no extra commentary). " +
      'If you cannot find a transcript, respond with exactly "NO_TRANSCRIPT_FOUND".\\n\\n' +
      truncatedHtml;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { error: "Gemini API request failed.", detail: errText },
        { status: 502 }
      );
    }

    const geminiData: any = await geminiRes.json();
    const text =
      geminiData.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join(" ")
        .trim() || "";

    if (!text) {
      return NextResponse.json(
        { error: "Gemini did not return any transcript text." },
        { status: 500 }
      );
    }

    if (text.includes("NO_TRANSCRIPT_FOUND")) {
      return NextResponse.json(
        { error: "No transcript found for this video." },
        { status: 404 }
      );
    }

    return NextResponse.json({ transcript: text });
  } catch (err) {
    console.error("Transcript API error:", err);
    return NextResponse.json(
      { error: "Unexpected error while fetching transcript." },
      { status: 500 }
    );
  }
}

