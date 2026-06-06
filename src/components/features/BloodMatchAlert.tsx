import { EmergencyContact } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { bloodTypeCompat } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface BloodMatchAlertProps {
  patientBloodType: string;
  contacts: EmergencyContact[];
}

export function BloodMatchAlert({ patientBloodType, contacts }: BloodMatchAlertProps) {
  const compatible = contacts.filter(
    c => c.blood_type && bloodTypeCompat(patientBloodType, c.blood_type)
  );

  if (!compatible.length) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="h-5 w-5 text-teal" />
        <p className="font-semibold text-teal text-sm">Compatible Blood Donors Available</p>
      </div>
      <p className="text-xs text-gray mb-3">
        The following emergency contacts have blood types compatible with patient ({patientBloodType}):
      </p>
      <div className="space-y-2">
        {compatible.map(c => (
          <div key={c.id} className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy">{c.name}</span>
            <div className="flex items-center gap-2">
              <Badge variant="success">{c.blood_type}</Badge>
              <a href={`tel:${c.phone}`} className="text-xs text-teal hover:underline">{c.phone}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
