"use client";

import { useState, useEffect } from 'react';
import { EmergencyContact } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus, Phone, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(9, 'Valid phone required'),
  relationship: z.string().optional(),
  blood_type: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function EmergencyContactList() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const res = await fetch('/api/emergency-contacts');
    const data = await res.json();
    setContacts(data.contacts || []);
    setLoading(false);
  };

  const onAdd = async (data: ContactForm) => {
    const res = await fetch('/api/emergency-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast('Contact added!', 'success');
      reset();
      setShowModal(false);
      fetchContacts();
    } else {
      toast('Failed to add contact', 'error');
    }
  };

  const onDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/emergency-contacts?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast('Contact removed', 'info');
      setContacts(prev => prev.filter(c => c.id !== id));
    } else {
      toast('Failed to delete', 'error');
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-navy">Emergency Contacts</h3>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      {contacts.length === 0 && (
        <p className="text-sm text-gray text-center py-6">No emergency contacts yet. Add one to be prepared.</p>
      )}

      {contacts.map(c => (
        <Card key={c.id} className="flex items-center gap-3 p-4">
          <Avatar name={c.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-navy truncate">{c.name}</p>
            <p className="text-xs text-gray">{c.relationship}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {c.blood_type && <Badge variant="danger">{c.blood_type}</Badge>}
            <a
              href={`tel:${c.phone}`}
              className="p-2 rounded-full bg-teal-light hover:bg-teal hover:text-white text-teal transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              onClick={() => onDelete(c.id)}
              disabled={deleting === c.id}
              className="p-2 rounded-full hover:bg-red-50 text-gray hover:text-danger transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </Card>
      ))}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Emergency Contact">
        <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Phone Number" type="tel" error={errors.phone?.message} {...register('phone')} />
          <Input label="Relationship" placeholder="e.g. Spouse, Parent" {...register('relationship')} />
          <div>
            <label className="text-sm font-medium text-navy block mb-1.5">Blood Type</label>
            <select
              {...register('blood_type')}
              className="w-full h-11 px-3 rounded-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="">Unknown</option>
              {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">Save Contact</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
