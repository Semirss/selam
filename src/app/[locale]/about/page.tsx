import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Brain, QrCode, Globe, Shield, Heart, Users } from 'lucide-react';

const TEAM = [
  { name: 'Selam Health Team', role: 'Platform Engineering', initials: 'SH' },
];

const VALUES = [
  { icon: Heart, title: 'Patient First', desc: 'Every feature is designed around improving health outcomes for real people.' },
  { icon: Globe, title: 'Multilingual by Design', desc: 'Built from day one to serve Amharic, Tigrinya, Afaan Oromoo, and English speakers.' },
  { icon: Shield, title: 'Privacy & Dignity', desc: 'Anonymous wellness sessions, minimal data collection, and transparent policies.' },
  { icon: Users, title: 'Community Impact', desc: 'Working with NGOs and community health workers across Ethiopia and East Africa.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-5xl font-bold mb-4">About Selam</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            We believe every person in East Africa deserves access to quality mental wellness support
            and a medical identity they can carry anywhere.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-navy mb-4">Our Mission</h2>
              <p className="text-gray leading-relaxed mb-4">
                Ethiopia has approximately 1 psychiatrist per 1,000,000 people. Over 80% of patients arrive
                at emergency departments without any medical record. We built Selam to close this gap.
              </p>
              <p className="text-gray leading-relaxed">
                Selam combines an AI-powered wellness companion with a universal health identity system —
                all in four local languages, built for the realities of East African healthcare.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, label: 'AI Wellness', sub: 'Gemini-powered' },
                { icon: QrCode, label: 'Health ID', sub: 'QR-based records' },
                { icon: Globe, label: '4 Languages', sub: 'en / am / ti / om' },
                { icon: Shield, label: 'Private', sub: 'Anonymous mode' },
              ].map(item => (
                <Card key={item.label} className="p-4 text-center">
                  <item.icon className="h-8 w-8 text-teal mx-auto mb-2" />
                  <p className="font-semibold text-navy text-sm">{item.label}</p>
                  <p className="text-xs text-gray">{item.sub}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-off-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <Card key={v.title} hoverLift className="p-6 flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
                  <v.icon className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">{v.title}</h3>
                  <p className="text-sm text-gray">{v.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
