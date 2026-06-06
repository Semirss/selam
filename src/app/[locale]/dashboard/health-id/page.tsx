"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { QRDisplay } from '@/components/features/QRDisplay';
import { EmergencyContactList } from '@/components/features/EmergencyContactList';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/Toast';
import type { PatientRecord } from '@/types';

const recordSchema = z.object({
  blood_type: z.string().optional(),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  medications: z.string().optional(),
});
type RecordForm = z.infer<typeof recordSchema>;
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function HealthIdContent() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<RecordForm>({
    resolver: zodResolver(recordSchema),
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/patient-record').then(r => r.json()),
    ]).then(([u, r]) => {
      setUser(u.user);
      setRecord(r.record);
      if (r.record) {
        reset({
          blood_type: r.record.blood_type || '',
          allergies: r.record.allergies?.join(', ') || '',
          conditions: r.record.conditions?.join(', ') || '',
          medications: r.record.medications?.join(', ') || '',
        });
      }
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSave = async (data: RecordForm) => {
    const parsed = {
      blood_type: data.blood_type || undefined,
      allergies: data.allergies ? data.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      conditions: data.conditions ? data.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      medications: data.medications ? data.medications.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    const res = await fetch('/api/patient-record', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    if (res.ok) {
      const { record: updated } = await res.json();
      setRecord(updated);
      toast('Record updated!', 'success');
      setEditOpen(false);
    } else {
      toast('Failed to update record', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: QR + record */}
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-semibold text-navy mb-5">Your Health QR ID</h2>
          {record ? (
            <QRDisplay qrUid={record.qr_uid} name={user?.full_name || ''} />
          ) : (
            <p className="text-sm text-gray text-center py-4">No QR ID found</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy">Medical Record</h2>
            <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>Edit Record</Button>
          </div>
          <div className="space-y-4">
            {record?.blood_type && (
              <div>
                <p className="text-xs text-gray mb-1.5">Blood Type</p>
                <Badge variant="danger">{record.blood_type}</Badge>
              </div>
            )}
            {record?.conditions?.length ? (
              <div>
                <p className="text-xs text-gray mb-1.5">Conditions</p>
                <div className="flex flex-wrap gap-1.5">
                  {record.conditions.map((c, i) => <Badge key={i} variant="outline">{c}</Badge>)}
                </div>
              </div>
            ) : null}
            {record?.medications?.length ? (
              <div>
                <p className="text-xs text-gray mb-1.5">Medications</p>
                <div className="flex flex-wrap gap-1.5">
                  {record.medications.map((m, i) => <Badge key={i} variant="default">{m}</Badge>)}
                </div>
              </div>
            ) : null}
            {record?.allergies?.length ? (
              <div>
                <p className="text-xs text-gray mb-1.5">Allergies</p>
                <div className="flex flex-wrap gap-1.5">
                  {record.allergies.map((a, i) => <Badge key={i} variant="warning">{a}</Badge>)}
                </div>
              </div>
            ) : null}
            {!record?.conditions?.length && !record?.medications?.length && !record?.allergies?.length && (
              <p className="text-sm text-gray">No medical information recorded yet. Click Edit Record to add.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Right: Emergency Contacts */}
      <Card className="p-6 h-fit">
        <EmergencyContactList />
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Medical Record">
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy block mb-1.5">Blood Type</label>
            <select {...register('blood_type')} className="w-full h-11 px-3 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal">
              <option value="">Unknown</option>
              {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
          <Input label="Conditions (comma separated)" placeholder="e.g. Diabetes, Hypertension" {...register('conditions')} />
          <Input label="Medications (comma separated)" placeholder="e.g. Metformin, Lisinopril" {...register('medications')} />
          <Input label="Allergies (comma separated)" placeholder="e.g. Penicillin, Peanuts" {...register('allergies')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function HealthIdPage() {
  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="client" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy mb-6">Health ID</h1>
            <HealthIdContent />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
