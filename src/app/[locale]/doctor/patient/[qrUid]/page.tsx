"use client";

import { useEffect, useState, use } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { PatientCard } from '@/components/features/PatientCard';
import { BloodMatchAlert } from '@/components/features/BloodMatchAlert';
import { ChatInterface } from '@/components/features/ChatInterface';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

const diagnosisSchema = z.object({
  diagnosis_code: z.string().min(1, 'Diagnosis code is required'),
  notes: z.string().optional(),
});
type DiagnosisForm = z.infer<typeof diagnosisSchema>;

function PatientViewContent({ qrUid }: { qrUid: string }) {
  const locale = useLocale();
  const { toast } = useToast();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DiagnosisForm>({
    resolver: zodResolver(diagnosisSchema),
  });

  useEffect(() => {
    fetch(`/api/scan?qrUid=${encodeURIComponent(qrUid)}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setRecord(d.record);
      })
      .catch(() => setError('Failed to load patient data'))
      .finally(() => setLoading(false));
  }, [qrUid]);

  const onAddDiagnosis = async (data: DiagnosisForm) => {
    if (!record?.profiles?.id) return;
    const res = await fetch('/api/diagnoses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: record.profiles.id, ...data }),
    });
    if (res.ok) {
      toast('Diagnosis added!', 'success');
      reset();
      // Refresh record
      const updated = await fetch(`/api/scan?qrUid=${encodeURIComponent(qrUid)}`).then(r => r.json());
      if (updated.record) setRecord(updated.record);
    } else {
      toast('Failed to add diagnosis', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-danger font-semibold mb-2">{error}</p>
        <p className="text-sm text-gray">QR ID: {qrUid}</p>
        <Link href={`/${locale}/doctor`}>
          <Button className="mt-4" variant="secondary">← Back to Dashboard</Button>
        </Link>
      </Card>
    );
  }

  const patientBloodType = record?.blood_type || record?.profiles?.blood_type;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main patient data: 2/3 */}
      <div className="xl:col-span-2 space-y-6">
        <PatientCard record={record} patientBloodType={patientBloodType} />

        {/* Blood match alert */}
        {patientBloodType && record?.emergency_contacts?.length > 0 && (
          <BloodMatchAlert patientBloodType={patientBloodType} contacts={record.emergency_contacts} />
        )}

        {/* Add Diagnosis */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy mb-4">Add Diagnosis</h3>
          <form onSubmit={handleSubmit(onAddDiagnosis)} className="space-y-4">
            <Input
              label="Diagnosis Code (ICD-10)"
              placeholder="e.g. J06.9, E11, I10"
              error={errors.diagnosis_code?.message}
              {...register('diagnosis_code')}
            />
            <div>
              <label className="text-sm font-medium text-navy block mb-1.5">Notes</label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Clinical notes, observations, treatment plan..."
                className="w-full px-3 py-2 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
              />
            </div>
            <Button type="submit" isLoading={isSubmitting}>Save Diagnosis</Button>
          </form>
        </Card>
      </div>

      {/* AI Assistant sidebar: 1/3 */}
      <div>
        <Card className="p-5 h-[600px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-navy flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-navy text-sm">AI Diagnostic Support</p>
              <p className="text-[10px] text-gray">Decision support only</p>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ChatInterface locale="en" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-light">
            <p className="text-[10px] text-gray text-center">
              ⚠️ This is clinical decision support only. The attending physician must make all diagnostic and treatment decisions.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PatientViewPage({ params }: { params: Promise<{ qrUid: string }> }) {
  const locale = useLocale();
  const { qrUid } = use(params);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="doctor" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Link href={`/${locale}/doctor`}>
                <button className="p-2 rounded-lg hover:bg-gray-light transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray" />
                </button>
              </Link>
              <h1 className="font-display text-2xl font-bold text-navy">Patient View</h1>
            </div>
            <PatientViewContent qrUid={qrUid} />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
