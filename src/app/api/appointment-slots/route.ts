import { NextRequest, NextResponse } from 'next/server';

// ⚠️ RUTA DESHABILITADA EN MODO DEMO
// Este endpoint ya no se usa - la aplicación utiliza datos mock

const BASE_URL = 'https://api.example.com/api/v1';
const TOKEN = process.env.API_TOKEN ?? process.env.NEXT_PUBLIC_API_TOKEN ?? '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'startDate and endDate required' }, { status: 400 });
  }

  const params = new URLSearchParams({ startDate, endDate });
  const res = await fetch(`${BASE_URL}/appointments/appointmentSlots?${params}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: `API error ${res.status}` }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
