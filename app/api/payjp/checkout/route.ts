import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";

function auth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "No token" }, { status: 400 });

  try {
    const res = await fetch(`${PAYJP_API}/charges`, {
      method: "POST",
      headers: {
        Authorization: auth(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        card: token,
        amount: "980",
        currency: "jpy",
        capture: "true",
        description: "一生で損する金額を算出 プレミアムレポート",
      }).toString(),
    });

    const charge = await res.json();
    if (charge.error) {
      return NextResponse.json({ error: charge.error.message }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("premium", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365 * 10,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "決済処理に失敗しました" }, { status: 500 });
  }
}
