// Datos mock para módulos de Cirugía y Caja - SOLO PARA DEMOSTRACIÓN

export interface MockSurgery {
  id: string;
  fecha: string;
  hora: string;
  paciente: string;
  dni: string;
  edad: number;
  cirujano: string;
  tipoCirugia: string;
  ojo: 'OD' | 'OI' | 'AO';
  estado: 'programada' | 'en-curso' | 'finalizada' | 'cancelada';
  sucursal: string;
  duracionEstimada: number; // minutos
  obraSocial: string;
  notasPreOperatorias?: string;
}

export interface MockCashMovement {
  id: string;
  fecha: string;
  hora: string;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  categoria: 'consulta' | 'cirugia' | 'estudio' | 'medicamento' | 'gasto' | 'otro';
  monto: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';
  sucursal: string;
  paciente?: string;
  comprobante?: string;
  observaciones?: string;
}

const pacientesCirugia = [
  { nombre: 'Roberto Fernández', dni: '14523678', edad: 65 },
  { nombre: 'Elena Morales', dni: '23987456', edad: 58 },
  { nombre: 'Carlos Vega', dni: '31245789', edad: 72 },
  { nombre: 'Patricia Rojas', dni: '28456123', edad: 61 },
  { nombre: 'Jorge Luna', dni: '19876543', edad: 68 },
  { nombre: 'Silvia Castro', dni: '25789456', edad: 54 },
  { nombre: 'Raúl Mendoza', dni: '17654321', edad: 70 },
  { nombre: 'Mónica Herrera', dni: '30123987', edad: 59 },
  { nombre: 'Alberto Suárez', dni: '22789654', edad: 66 },
  { nombre: 'Graciela Peralta', dni: '27456789', edad: 63 },
];

const cirujanos = [
  'Dr. Javier Molina',
  'Dra. Claudia Espinoza',
  'Dr. Marcelo Ríos',
  'Dra. Valeria Campos',
];

const tiposCirugia = [
  { nombre: 'Facoemulsificación con LIO', duracion: 45 },
  { nombre: 'Cirugía de Pterigión', duracion: 30 },
  { nombre: 'Vitrectomía', duracion: 90 },
  { nombre: 'Cirugía de Glaucoma', duracion: 60 },
  { nombre: 'Blefaroplastia', duracion: 50 },
  { nombre: 'Cirugía Refractiva LASIK', duracion: 25 },
  { nombre: 'Inyección Intravítrea', duracion: 15 },
  { nombre: 'Reparación de Desprendimiento de Retina', duracion: 120 },
];

const sucursales = ['Centro Norte', 'Centro Sur', 'Clínica Anexo', 'Sede Principal'];

const obrasSociales = ['OSDE', 'Swiss Medical', 'Galeno', 'PAMI', 'IOMA', 'Particular'];

const estadosCirugia = [
  { code: 'programada', name: 'Programada', weight: 45 },
  { code: 'finalizada', name: 'Finalizada', weight: 40 },
  { code: 'en-curso', name: 'En Curso', weight: 10 },
  { code: 'cancelada', name: 'Cancelada', weight: 5 },
];

const conceptosCaja = {
  ingreso: [
    'Consulta oftalmológica',
    'Control de rutina',
    'Examen de vista',
    'Topografía corneal',
    'Campo visual',
    'Cirugía de cataratas',
    'Cirugía refractiva',
    'Inyección intravítrea',
    'Venta de lentes',
    'Venta de medicamentos',
  ],
  egreso: [
    'Compra de insumos médicos',
    'Pago de servicios',
    'Sueldos profesionales',
    'Mantenimiento equipos',
    'Limpieza y sanitización',
    'Material descartable',
    'Medicamentos stock',
    'Gastos administrativos',
  ],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function randomTimeSlot(): string {
  const slots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  return randomItem(slots);
}

function getEstadoPonderado(estados: typeof estadosCirugia) {
  const random = Math.random() * 100;
  let accumulated = 0;
  for (const estado of estados) {
    accumulated += estado.weight;
    if (random <= accumulated) {
      return estado;
    }
  }
  return estados[0];
}

export function generateMockSurgeries(startDate: string, endDate: string, count: number = 50): MockSurgery[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const surgeries: MockSurgery[] = [];

  for (let i = 0; i < count; i++) {
    const date = randomDate(start, end);
    const paciente = randomItem(pacientesCirugia);
    const cirujano = randomItem(cirujanos);
    const tipoCirugia = randomItem(tiposCirugia);
    const estado = getEstadoPonderado(estadosCirugia);
    const ojo = randomItem(['OD', 'OI', 'AO'] as const);

    surgeries.push({
      id: `cir-${1000 + i}`,
      fecha: formatDate(date),
      hora: randomTimeSlot(),
      paciente: paciente.nombre,
      dni: paciente.dni,
      edad: paciente.edad,
      cirujano,
      tipoCirugia: tipoCirugia.nombre,
      ojo,
      estado: estado.code as MockSurgery['estado'],
      sucursal: randomItem(sucursales),
      duracionEstimada: tipoCirugia.duracion,
      obraSocial: randomItem(obrasSociales),
    });
  }

  return surgeries.sort((a, b) => {
    const dateA = a.fecha + a.hora;
    const dateB = b.fecha + b.hora;
    return dateB.localeCompare(dateA);
  });
}

export function generateMockCashMovements(startDate: string, endDate: string, count: number = 200): MockCashMovement[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const movements: MockCashMovement[] = [];

  for (let i = 0; i < count; i++) {
    const date = randomDate(start, end);
    const tipo = Math.random() > 0.35 ? 'ingreso' : 'egreso';
    const concepto = tipo === 'ingreso' 
      ? randomItem(conceptosCaja.ingreso)
      : randomItem(conceptosCaja.egreso);
    
    let categoria: MockCashMovement['categoria'];
    if (concepto.includes('Consulta') || concepto.includes('Control') || concepto.includes('Examen')) {
      categoria = 'consulta';
    } else if (concepto.includes('Cirugía')) {
      categoria = 'cirugia';
    } else if (concepto.includes('visual') || concepto.includes('Topografía') || concepto.includes('Campo')) {
      categoria = 'estudio';
    } else if (concepto.includes('medicamento') || concepto.includes('Medicamentos')) {
      categoria = 'medicamento';
    } else if (tipo === 'egreso') {
      categoria = 'gasto';
    } else {
      categoria = 'otro';
    }

    const monto = tipo === 'ingreso'
      ? Math.floor(Math.random() * 80000) + 5000 // $5,000 - $85,000
      : Math.floor(Math.random() * 50000) + 2000; // $2,000 - $52,000

    const hour = 8 + Math.floor(Math.random() * 11);
    const minute = Math.floor(Math.random() * 60);

    movements.push({
      id: `mov-${2000 + i}`,
      fecha: formatDate(date),
      hora: formatTime(hour, minute),
      tipo,
      concepto,
      categoria,
      monto,
      metodoPago: randomItem(['efectivo', 'tarjeta', 'transferencia', 'qr'] as const),
      sucursal: randomItem(sucursales),
      paciente: tipo === 'ingreso' && categoria !== 'otro' ? randomItem(pacientesCirugia).nombre : undefined,
      comprobante: tipo === 'ingreso' ? `${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}-${String(Math.floor(Math.random() * 9999999)).padStart(8, '0')}` : undefined,
    });
  }

  return movements.sort((a, b) => {
    const dateA = a.fecha + a.hora;
    const dateB = b.fecha + b.hora;
    return dateB.localeCompare(dateA);
  });
}

export function getMockSurgeryData(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const surgeriesPerDay = 2;
  const totalSurgeries = Math.max(days * surgeriesPerDay, 20);

  return generateMockSurgeries(startDate, endDate, totalSurgeries);
}

export function getMockCashData(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const movementsPerDay = 25;
  const totalMovements = Math.max(days * movementsPerDay, 100);

  return generateMockCashMovements(startDate, endDate, totalMovements);
}
