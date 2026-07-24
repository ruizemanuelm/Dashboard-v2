// Datos de prueba para la demo - sin datos reales

export interface MockAdmission {
  generalAdmissionId: string;
  visitReason: string;
  admission: {
    admissionId: string;
    patientId: string;
    branchId: string;
    scheduledDate: string;
    scheduledTime: string;
    admissionStatus: {
      code: string;
      name: string;
    };
    admissionType: {
      code: string;
      name: string;
    };
    admissionIssuer: {
      code: string;
    };
    performingResource: {
      name: string;
    };
    referringResource: {
      name: string;
    };
    branch: {
      branchId: string;
      name: string;
      code: string;
    };
    patient: {
      patientId: string;
      actor: {
        nameOne: string;
        nameTwo: string;
        dni?: string;
        obraSocial?: string;
      };
    };
  };
}

export interface MockSlot {
  appointmentSlotId: string;
  appointmentDate: string;
  appointmentTime: string;
  isAbsent: boolean;
  patient: null | { patientId: string; actor: { nameOne: string; nameTwo: string } };
  appointmentStatus: {
    code: string;
    name: string;
  };
  appointmentReason: {
    name: string;
  } | null;
  schedule: {
    agenda: {
      name: string;
      branchId: string;
      branch: {
        branchId: string;
        name: string;
        code: string;
      };
      resource: {
        name: string;
      };
    };
  };
}

// IDs de sucursales demo
const BRANCH_IDS = {
  norte: 'branch-001',
  sur: 'branch-002',
  anexo: 'branch-003',
  yerbaBuena: 'branch-004',
};

const pacientesDemo = [
  { nombre: 'María García', dni: '12345678', obraSocial: 'OSDE' },
  { nombre: 'Juan Pérez', dni: '23456789', obraSocial: 'Swiss Medical' },
  { nombre: 'Ana Rodríguez', dni: '34567890', obraSocial: 'Galeno' },
  { nombre: 'Carlos López', dni: '45678901', obraSocial: 'OSECAC' },
  { nombre: 'Laura Martínez', dni: '56789012', obraSocial: 'IOMA' },
  { nombre: 'Pedro González', dni: '67890123', obraSocial: 'OSDE' },
  { nombre: 'Sofía Fernández', dni: '78901234', obraSocial: 'Medifé' },
  { nombre: 'Diego Ramírez', dni: '89012345', obraSocial: 'Swiss Medical' },
  { nombre: 'Lucía Torres', dni: '90123456', obraSocial: 'PAMI' },
  { nombre: 'Martín Silva', dni: '11234567', obraSocial: 'Galeno' },
  { nombre: 'Valentina Gómez', dni: '22345678', obraSocial: 'OSDE' },
  { nombre: 'Facundo Castro', dni: '33456789', obraSocial: 'OSECAC' },
  { nombre: 'Camila Álvarez', dni: '44567890', obraSocial: 'IOMA' },
  { nombre: 'Sebastián Morales', dni: '55678901', obraSocial: 'Medifé' },
  { nombre: 'Florencia Ruiz', dni: '66789012', obraSocial: 'Swiss Medical' },
];

const medicosDemo = [
  'Dr. Roberto Sánchez',
  'Dra. Patricia Romero',
  'Dr. Fernando Díaz',
  'Dra. Gabriela Herrera',
  'Dr. Alejandro Núñez',
  'Dra. Carolina Vega',
  'Dr. Maximiliano Ortiz',
  'Dra. Verónica Luna',
];

const motivosDemo = [
  'Consulta oftalmológica',
  'Control de rutina',
  'Renovación de receta',
  'Examen de vista',
  'Fondo de ojo',
  'Topografía corneal',
  'Campo visual',
  'Evaluación preoperatoria',
];

const sucursales = [
  { id: BRANCH_IDS.norte, name: 'Centro Norte', code: 'CN' },
  { id: BRANCH_IDS.sur, name: 'Centro Sur', code: 'CS' },
  { id: BRANCH_IDS.anexo, name: 'Clínica Anexo', code: 'CA' },
  { id: BRANCH_IDS.yerbaBuena, name: 'Sede Principal', code: 'SP' },
];

const estados = [
  { code: 'FINISHED', name: 'Finalizada', weight: 60 },
  { code: 'NEW', name: 'Nuevo', weight: 20 },
  { code: 'CANCELLED', name: 'Cancelada', weight: 15 },
];

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
  const date = new Date(2024, 0, 1, hour, minute);
  return date.toISOString();
}

function randomTime(): string {
  const hour = 8 + Math.floor(Math.random() * 10); // 8-17
  const minute = Math.random() > 0.5 ? 0 : 30;
  return formatTime(hour, minute);
}

function getEstadoPonderado() {
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

export function generateMockAdmissions(startDate: string, endDate: string, count: number = 250): MockAdmission[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const admissions: MockAdmission[] = [];

  for (let i = 0; i < count; i++) {
    const date = randomDate(start, end);
    const sucursal = randomItem(sucursales);
    const paciente = randomItem(pacientesDemo);
    const medico = randomItem(medicosDemo);
    const motivo = randomItem(motivosDemo);
    const estado = getEstadoPonderado();
    const tipoAdmision = Math.random() > 0.8 ? 'NO_APPOINTMENT' : 'APPOINTMENT';
    const isReferral = Math.random() > 0.85;

    admissions.push({
      generalAdmissionId: `adm-${i + 1000}`,
      visitReason: motivo,
      admission: {
        admissionId: `adm-${i + 1000}`,
        patientId: `pat-${Math.floor(Math.random() * 500)}`,
        branchId: sucursal.id,
        scheduledDate: formatDate(date),
        scheduledTime: randomTime(),
        admissionStatus: {
          code: estado.code,
          name: estado.name,
        },
        admissionType: {
          code: tipoAdmision,
          name: tipoAdmision === 'NO_APPOINTMENT' ? 'Sin turno' : 'Con turno',
        },
        admissionIssuer: {
          code: 'SYSTEM',
        },
        performingResource: {
          name: medico,
        },
        referringResource: {
          name: isReferral ? randomItem(medicosDemo.filter(m => m !== medico)) : 'NINGUNO',
        },
        branch: {
          branchId: sucursal.id,
          name: sucursal.name,
          code: sucursal.code,
        },
        patient: {
          patientId: `pat-${Math.floor(Math.random() * 500)}`,
          actor: {
            nameOne: paciente.nombre,
            nameTwo: '',
            dni: paciente.dni,
            obraSocial: paciente.obraSocial,
          },
        },
      },
    });
  }

  return admissions.sort((a, b) => {
    const dateA = a.admission.scheduledDate + a.admission.scheduledTime;
    const dateB = b.admission.scheduledDate + b.admission.scheduledTime;
    return dateB.localeCompare(dateA);
  });
}

export function generateMockSlots(date: string, count: number = 80): MockSlot[] {
  const slots: MockSlot[] = [];

  for (let i = 0; i < count; i++) {
    const sucursal = randomItem(sucursales);
    const isFree = Math.random() > 0.35;

    slots.push({
      appointmentSlotId: `slot-${i + 2000}`,
      appointmentDate: date,
      appointmentTime: randomTime(),
      isAbsent: false,
      patient: null,
      appointmentStatus: {
        code: isFree ? 'FREE' : 'BUSY',
        name: isFree ? 'Libre' : 'Ocupado',
      },
      appointmentReason: isFree ? null : {
        name: randomItem(motivosDemo),
      },
      schedule: {
        agenda: {
          name: `Agenda ${randomItem(medicosDemo)}`,
          branchId: sucursal.id,
          branch: {
            branchId: sucursal.id,
            name: sucursal.name,
            code: sucursal.code,
          },
          resource: {
            name: randomItem(medicosDemo),
          },
        },
      },
    });
  }

  return slots;
}

// Helper para obtener los datos mock según el rango de fechas
export function getMockData(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const admissionsPerDay = 35;
  const totalAdmissions = Math.max(days * admissionsPerDay, 50);

  return {
    admissions: generateMockAdmissions(startDate, endDate, totalAdmissions),
    slots: generateMockSlots(endDate, 80),
  };
}
