"use client";

import { PatientRecord, EmergencyContact } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { BloodMatchAlert } from './BloodMatchAlert';
import { AlertTriangle, Pill, Activity, Phone } from 'lucide-react';
import { formatDate, bloodTypeCompat } from '@/lib/utils';

interface PatientCardProps {
  record: PatientRecord & {
    profiles: { full_name: string; blood_type?: string };
    diagnoses: { id: string; diagnosis_code: string; notes: string; created_at: string }[];
    emergency_contacts: EmergencyContact[];
  };
  patientBloodType?: string;
}

export function PatientCard({ record, patientBloodType }: PatientCardProps) {
  const { profiles, diagnoses, emergency_contacts } = record;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar name={profiles.full_name} size="lg" />
        <div>
          <h2 className="text-2xl font-bold text-navy font-display">{profiles.full_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            {record.blood_type && (
              <Badge variant="danger">{record.blood_type}</Badge>
            )}
            <span className="text-sm text-gray font-mono">ID: {record.qr_uid}</span>
          </div>
        </div>
      </div>

      {/* Medical Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-teal" />
            <h3 className="font-semibold text-navy text-sm">Conditions</h3>
          </div>
          {record.conditions?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {record.conditions.map((c, i) => <Badge key={i} variant="outline">{c}</Badge>)}
            </div>
          ) : <p className="text-xs text-gray">None recorded</p>}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-4 w-4 text-navy" />
            <h3 className="font-semibold text-navy text-sm">Medications</h3>
          </div>
          {record.medications?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {record.medications.map((m, i) => <Badge key={i} variant="default">{m}</Badge>)}
            </div>
          ) : <p className="text-xs text-gray">None recorded</p>}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="font-semibold text-navy text-sm">Allergies</h3>
          </div>
          {record.allergies?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {record.allergies.map((a, i) => <Badge key={i} variant="warning">{a}</Badge>)}
            </div>
          ) : <p className="text-xs text-gray">None recorded</p>}
        </Card>
      </div>

      {/* Diagnoses Timeline */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy mb-4">Diagnosis History</h3>
        {diagnoses.length ? (
          <div className="space-y-4 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gray-light">
            {diagnoses.map(d => (
              <div key={d.id} className="flex gap-4 pl-8 relative">
                <div className="absolute left-2 top-1 h-2.5 w-2.5 rounded-full bg-teal border-2 border-white" />
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">{d.diagnosis_code}</Badge>
                    <span className="text-xs text-gray">{formatDate(d.created_at)}</span>
                  </div>
                  {d.notes && <p className="text-sm text-dark mt-1">{d.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray">No diagnoses recorded</p>}
      </Card>

      {/* Emergency Contacts */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy mb-4">Emergency Contacts</h3>
        <div className="space-y-3">
          {emergency_contacts.length ? (
            emergency_contacts.map(contact => {
              const compatible = patientBloodType && contact.blood_type
                ? bloodTypeCompat(patientBloodType, contact.blood_type)
                : false;
              return (
                <div key={contact.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-gray-light">
                  <div className="flex items-center gap-3">
                    <Avatar name={contact.name} size="sm" />
                    <div>
                      <p className="font-medium text-navy text-sm">{contact.name}</p>
                      <p className="text-xs text-gray">{contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {contact.blood_type && (
                      <Badge variant={compatible ? 'success' : 'outline'}>{contact.blood_type}</Badge>
                    )}
                    <a href={`tel:${contact.phone}`} className="p-2 rounded-full bg-teal hover:bg-teal-mid transition-colors">
                      <Phone className="h-3.5 w-3.5 text-white" />
                    </a>
                  </div>
                </div>
              );
            })
          ) : <p className="text-sm text-gray">No emergency contacts</p>}
        </div>
      </Card>
    </div>
  );
}
