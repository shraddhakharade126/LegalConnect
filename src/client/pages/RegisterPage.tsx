import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import {
  Scale,
  User,
  Briefcase,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('client');

  // Basic Account Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Lawyer Specific
  const [barRegistrationNumber, setBarRegistrationNumber] = useState('');
  const [barCouncilState, setBarCouncilState] = useState('New York');
  const [yearOfAdmission, setYearOfAdmission] = useState('2016');
  const [primaryDomain, setPrimaryDomain] = useState('Corporate & Commercial');
  const [experienceYears, setExperienceYears] = useState('8');
  const [consultationFee, setConsultationFee] = useState('150');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const pwStrength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all mandatory account fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (role === 'lawyer' && (!barRegistrationNumber.trim() || !barCouncilState.trim())) {
      setError('Bar registration credentials are mandatory for advocate enrollment.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        // Lawyer fields
        barRegistrationNumber: barRegistrationNumber.trim() || undefined,
        barCouncilState: barCouncilState.trim() || undefined,
        yearOfAdmission: Number(yearOfAdmission) || undefined,
        primaryDomain: primaryDomain || undefined,
        experienceYears: Number(experienceYears) || undefined,
        consultationFee: Number(consultationFee) || undefined,
        bio: bio.trim() || undefined,
      });

      if (role === 'lawyer') {
        navigate('/lawyer-dashboard');
      } else {
        navigate('/client-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold mx-auto flex items-center justify-center shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Create Your LegalConnect Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Join the verified platform for legal consultations and case management
          </p>
        </div>

        {/* Role Selector Pill */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              role === 'client'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" /> I am a Client
          </button>
          <button
            type="button"
            onClick={() => setRole('lawyer')}
            className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              role === 'lawyer'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-blue-600" /> I am an Advocate
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Basic User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'lawyer' ? 'Adv. Johnathan Doe' : 'Jane Doe'}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                City / Jurisdiction
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York, NY"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Secure Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters with numbers & symbols"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              required
            />
            {/* Password strength meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="grid grid-cols-4 gap-1 h-1.5">
                  <div
                    className={`rounded-full transition-colors ${
                      pwStrength >= 1 ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-colors ${
                      pwStrength >= 2 ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-colors ${
                      pwStrength >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-colors ${
                      pwStrength >= 4 ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  {pwStrength < 2
                    ? 'Weak (add numbers/symbols)'
                    : pwStrength === 3
                    ? 'Good password'
                    : 'Strong security'}
                </span>
              </div>
            )}
          </div>

          {/* ADVOCATE SPECIFIC SECTION */}
          {role === 'lawyer' && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-900 text-xs">
                  Bar Enrollment & Practice Credentials
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                    Bar Registration Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={barRegistrationNumber}
                    onChange={(e) => setBarRegistrationNumber(e.target.value)}
                    placeholder="E.g., NY-BAR-2016-92812"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                    State Bar Council <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={barCouncilState}
                    onChange={(e) => setBarCouncilState(e.target.value)}
                    placeholder="New York, California, Illinois..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                    Primary Practice Domain
                  </label>
                  <select
                    value={primaryDomain}
                    onChange={(e) => setPrimaryDomain(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  >
                    <option value="Corporate & Commercial">Corporate & Commercial</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                    <option value="Criminal Defense">Criminal Defense</option>
                    <option value="Family & Matrimonial">Family & Matrimonial</option>
                    <option value="Real Estate & Property">Real Estate & Property</option>
                    <option value="Labor & Employment">Labor & Employment</option>
                    <option value="Cyber & Technology Law">Cyber & Technology Law</option>
                    <option value="Taxation & Wealth Planning">Taxation & Wealth Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                    Years of Practice
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    min="25"
                    max="1000"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summary of court appearances and legal focus..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                <strong>Verification Notice:</strong> Your account will be submitted to the Compliance
                Officer for Bar registry audit. Once approved, your profile will appear in the public
                directory.
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                Creating Secure Account...
              </>
            ) : (
              <>
                Complete Registration <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered on LegalConnect?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-amber-700 hover:text-amber-800 font-bold ml-1"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
