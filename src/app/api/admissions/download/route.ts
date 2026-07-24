import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.ocularyb.com.ar/api/v1';
const TOKEN    = process.env.NEXT_PUBLIC_OCULARYB_TOKEN ?? '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate   = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'startDate and endDate required' }, { status: 400 });
  }

  const params = new URLSearchParams({ startDate, endDate });
  const res = await fetch(
    `${BASE_URL}/general/admissions/report/download?${params}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `API error ${res.status}` }, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="admisiones-${startDate}-${endDate}.xlsx"`,
    },
  });
}
