import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Insight = { name?: string; values?: Array<{ value?: number }> };

const metricValue = (insights: Insight[], metric: string) => {
  const item = insights.find((insight) => insight.name === metric);
  return item?.values?.[0]?.value ?? null;
};

export async function GET() {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const version = process.env.INSTAGRAM_GRAPH_API_VERSION ?? "v23.0";

  if (!accountId || !accessToken) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const baseUrl = `https://graph.facebook.com/${version}/${accountId}`;
  const params = new URLSearchParams({ access_token: accessToken });

  try {
    const accountResponse = await fetch(`${baseUrl}?fields=followers_count,media_count&${params}`, { next: { revalidate: 300 } });
    if (!accountResponse.ok) throw new Error("Instagram account request failed");

    const account = await accountResponse.json() as { followers_count?: number; media_count?: number };
    const insightsResponse = await fetch(`${baseUrl}/insights?metric=reach,views&period=day&${params}`, { next: { revalidate: 300 } });
    const insightPayload = insightsResponse.ok ? await insightsResponse.json() as { data?: Insight[] } : { data: [] };
    const insights = insightPayload.data ?? [];

    return NextResponse.json({
      configured: true,
      followers: account.followers_count ?? null,
      posts: account.media_count ?? null,
      reach: metricValue(insights, "reach"),
      views: metricValue(insights, "views"),
      updatedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } });
  } catch {
    return NextResponse.json({ configured: false }, { status: 502 });
  }
}
