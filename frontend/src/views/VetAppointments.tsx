import React, { useState } from 'react';
import { CalendarDays, Clock, Info, StickyNote } from 'lucide-react';
import { format } from 'date-fns'; // Import format function from date-fns

type Appointment = {
  _id: string;
  petId?: { name: string };
  userId: { name: string };
  veterinarianId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  reason: string;
  notes?: string;
};

const initialAppointments: Appointment[] = [
  {
    _id: '1',
    petId: { name: 'Buddy' },
    userId: { name: 'Alice Smith' },
    veterinarianId: 'vet123',
    date: '2025-05-12',
    startTime: '10:00',
    endTime: '10:30',
    status: 'Scheduled',
    reason: 'Regular checkup',
    notes: 'First visit',
  },
  {
    _id: '2',
    userId: { name: 'John Doe' },
    veterinarianId: 'vet123',
    date: '2025-05-13',
    startTime: '14:00',
    endTime: '14:30',
    status: 'Completed',
    reason: 'Vaccination',
  },
  {
    _id: '3',
    petId: { name: 'Luna' },
    userId: { name: 'Jane Wilson' },
    veterinarianId: 'vet123',
    date: '2025-05-14',
    startTime: '16:00',
    endTime: '16:30',
    status: 'Cancelled',
    reason: 'Skin rash',
    notes: 'Cancelled by user',
  },
  {
    _id: '4',
    petId: { name: 'Max' },
    userId: { name: 'Emily Brown' },
    veterinarianId: 'vet123',
    date: '2025-05-15',
    startTime: '11:00',
    endTime: '11:30',
    status: 'Scheduled',
    reason: 'Dental checkup',
    notes: 'Possible tooth pain',
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-[color:var(--color-secondary)] text-white';
    case 'cancelled':
      return 'bg-[color:var(--color-primary)] text-white';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


const VetAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // Sort appointments: Scheduled appointments come first, then Completed, then Cancelled
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.status === 'Scheduled' && b.status !== 'Scheduled') return -1;
    if (a.status === 'Completed' && b.status !== 'Completed') return 1;
    return 0;
  });

  const updateStatus = (id: string, newStatus: 'Completed' | 'Cancelled') => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );
    // TODO: Add API call to update backend
  };

  return (
    <div className="p-6 bg-[color:var(--color-light)] min-h-screen text-[color:var(--color-text)]">
      <h1 className="text-2xl font-bold mb-6 text-[color:var(--color-primary)]">Your Appointments</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className={`rounded-2xl p-5 bg-gradient-to-br from-white via-[color:var(--color-light)] to-white shadow-xl border-2 transition-transform transform hover:scale-[1.015] duration-200 ${
              appointment.status === 'Scheduled'
                ? 'border-[color:var(--color-primary)]'
                : 'border-gray-200'
            }`}
          >
            <div className="mb-4 space-y-1">
              <p className="text-xl font-bold text-[color:var(--color-primary)]">
                {appointment.petId ? `${appointment.petId.name} - ` : ''}
                {appointment.userId.name}
              </p>

              <div className="flex items-center text-sm text-gray-600">
                <CalendarDays className="w-4 h-4 mr-1" />
                {/* Format the date */}
                {format(new Date(appointment.date), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {appointment.startTime} - {appointment.endTime}
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium text-gray-800 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Reason: <span className="ml-1 font-normal">{appointment.reason}</span>
                </p>
                {appointment.notes && (
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <StickyNote className="w-4 h-4 mr-1" />
                    Notes: <span className="ml-1">{appointment.notes}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold w-max ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
              {appointment.status === 'Scheduled' && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-sm px-3 py-1 rounded-md bg-[color:var(--color-secondary)] hover:bg-[color:var(--color-secondary-light)] text-white"
                    onClick={() => updateStatus(appointment._id, 'Completed')}
                  >
                    Mark Complete
                  </button>
                  <button
                    className="text-sm px-3 py-1 rounded-md bg-[color:var(--color-primary)] hover:bg-red-700 text-white"
                    onClick={() => updateStatus(appointment._id, 'Cancelled')}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetAppointments;
