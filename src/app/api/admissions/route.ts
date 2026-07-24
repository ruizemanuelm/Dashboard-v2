import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

// ⚠️ RUTA DESHABILITADA EN MODO DEMO
// Este endpoint ya no se usa - la aplicación utiliza datos mock

const BASE_URL = 'https://api.example.com/api/v1';
const TOKEN    = process.env.NEXT_PUBLIC_API_TOKEN ?? '';

// ── EXCEL (activo) ────────────────────────────────────────────────────────────

const BRANCH_NAME_TO_ID: Record<string, string> = {
  'YERBA BUENA':  '9a3a6329-5c4e-4019-8b31-032ff4554caa',
  'ANEXO':        '6fd4921e-dba2-4447-ad7d-44ed57d59afe',
  'BARRIO NORTE': 'e9487193-3b74-4a5a-92ac-83518d67f66c',
  'BARRIO SUR':   'e8e1395f-31ca-4091-900c-2ad1b7af42b3',
};

const BRANCH_NAME_TO_CODE: Record<string, string> = {
  'YERBA BUENA': 'YB', 'ANEXO': 'AN', 'BARRIO NORTE': 'BN', 'BARRIO SUR': 'BS',
};

const STATUS_MAP: Record<string, string> = {
  'FINALIZADA': 'FINISHED',
  'NUEVO':      'NEW',
  'CANCELADA':  'CANCELLED',
};

function excelSerialToDateISO(serial: number): string {
  const d = new Date((Math.floor(serial) - 25569) * 86400 * 1000);
  return d.toISOString();
}

function excelSerialToTimeISO(serial: number): string {
  const totalSec = Math.round((serial % 1) * 86400);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  return `1970-01-01T${hh}:${mm}:00.000Z`;
}

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
    { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `API error ${res.status}` }, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  const wb    = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  const ws    = wb.Sheets[wb.SheetNames[0]];
  const rows  = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });

  const admissions = rows.slice(1)
    .filter(row => Array.isArray(row) && row[0])
    .map(row => {
      const r = row as unknown[];
      const branchName = String(r[0] ?? '');
      const branchId   = BRANCH_NAME_TO_ID[branchName] ?? '';
      const branchCode = BRANCH_NAME_TO_CODE[branchName] ?? '??';

      const fechaCreacion   = Number(r[2]);
      const fechaProgramada = Number(r[3]);

      const scheduledDate = excelSerialToDateISO(fechaProgramada);
      const scheduledTime = excelSerialToTimeISO(fechaCreacion);

      const statusName = String(r[13] ?? '');
      const statusCode = STATUS_MAP[statusName] ?? statusName;

      const tipoName = String(r[14] ?? '');
      const typeCode = (tipoName.toUpperCase().includes('ESPONTÁN') || tipoName.toUpperCase().includes('ESPONTАН'))
        ? 'NO_APPOINTMENT'
        : 'APPOINTMENT';

      const paciente   = String(r[6]  ?? '');
      const derivante  = String(r[16] ?? 'NINGUNO');
      const dni        = String(r[5]  ?? '');
      const obraSocial = String(r[7]  ?? '');

      return {
        generalAdmissionId: String(r[1] ?? ''),
        visitReason: String(r[11] ?? ''),
        admission: {
          admissionId:      String(r[1] ?? ''),
          patientId:        String(r[4]  ?? ''),
          branchId,
          scheduledDate,
          scheduledTime,
          admissionStatus:     { code: statusCode, name: statusName },
          admissionType:       { code: typeCode,   name: tipoName },
          admissionIssuer:     { code: 'INTERNAL' },
          performingResource:  { name: String(r[15] ?? '—') },
          referringResource:   { name: derivante },
          branch: { branchId, name: branchName, code: branchCode },
          patient: {
            patientId: String(r[4] ?? ''),
            actor: { nameOne: paciente, nameTwo: '', dni, obraSocial },
          },
        },
      };
    });

  return NextResponse.json(admissions);
}

// ── JSON API (comentado — demasiado lento por volumen de datos) ───────────────
// Para activar: eliminar el bloque EXCEL de arriba y descomentar todo esto.
// También agregar al import de arriba: { unstable_cache } from 'next/cache'
//
// const HEADERS_JSON = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
//
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function normalize(item: any) {
//   const adm      = item.admission ?? {};
//   const patient  = adm.patient ?? {};
//   const docType  = patient.documentType?.code ?? 'DNI';
//   const docNum   = patient.documentNumber ?? '';
//   const obraSocial =
//     adm.affiliate?.primaryPlan?.insurance?.actor?.nameOne ??
//     adm.affiliate?.primaryPlan?.insurance?.providerNumber ?? '';
//   return {
//     generalAdmissionId: item.generalAdmissionId,
//     visitReason: item.visitReason ?? '',
//     admission: {
//       admissionId:     adm.admissionId,
//       patientId:       adm.patientId,
//       branchId:        adm.branchId,
//       scheduledDate:   adm.scheduledDate,
//       scheduledTime:   adm.scheduledTime,
//       admissionStatus:    { code: adm.admissionStatus?.code,  name: adm.admissionStatus?.name },
//       admissionType:      { code: adm.admissionType?.code,    name: adm.admissionType?.name },
//       admissionIssuer:    { code: adm.admissionIssuer?.code ?? 'INTERNAL' },
//       performingResource: { name: adm.performingResource?.name ?? '—' },
//       referringResource:  { name: adm.referringResource?.name ?? 'NINGUNO' },
//       branch: { branchId: adm.branch?.branchId, name: adm.branch?.name, code: adm.branch?.code },
//       patient: {
//         patientId: patient.patientId,
//         actor: {
//           nameOne:    [patient.actor?.nameTwo, patient.actor?.nameOne].filter(Boolean).join(' '),
//           nameTwo:    '',
//           dni:        docNum ? `${docType} ${docNum}` : '',
//           obraSocial,
//         },
//       },
//     },
//   };
// }
//
// async function fetchAllAdmissions(startDate: string, endDate: string) {
//   const take = 500;
//   const firstParams = new URLSearchParams({ startDate, endDate, skip: '0', take: String(take) });
//   const firstRes = await fetch(`${BASE_URL}/general/admissions?${firstParams}`, { headers: HEADERS_JSON });
//   if (!firstRes.ok) throw new Error(`API error ${firstRes.status}`);
//   const firstJson = await firstRes.json();
//   const all: unknown[] = (Array.isArray(firstJson) ? firstJson : (firstJson.data ?? [])).map(normalize);
//   if (firstJson.hasMore && firstJson.total) {
//     const remaining = Math.ceil((firstJson.total - take) / take);
//     const pages = await Promise.all(
//       Array.from({ length: remaining }, (_, i) => {
//         const skip = (i + 1) * take;
//         const params = new URLSearchParams({ startDate, endDate, skip: String(skip), take: String(take) });
//         return fetch(`${BASE_URL}/general/admissions?${params}`, { headers: HEADERS_JSON })
//           .then(r => r.json())
//           .then(j => (Array.isArray(j) ? j : (j.data ?? [])) as unknown[]);
//       })
//     );
//     for (const page of pages) all.push(...page.map(normalize));
//   }
//   return all;
// }
//
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const startDate = searchParams.get('startDate');
//   const endDate   = searchParams.get('endDate');
//   if (!startDate || !endDate)
//     return NextResponse.json({ error: 'startDate and endDate required' }, { status: 400 });
//   try {
//     const cached = unstable_cache(
//       () => fetchAllAdmissions(startDate, endDate),
//       [`admissions-${startDate}-${endDate}`],
//       { revalidate: 120 }
//     );
//     return NextResponse.json(await cached());
//   } catch (e: unknown) {
//     const msg = e instanceof Error ? e.message : 'Error desconocido';
//     return NextResponse.json({ error: msg }, { status: 500 });
//   }
// }
