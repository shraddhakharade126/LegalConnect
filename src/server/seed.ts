import bcrypt from 'bcryptjs';
import { DataStore } from './models/store.ts';
import { connectDB } from './config/db.ts';

export async function seedDatabase(): Promise<void> {
  console.log('Seeding initial LegalConnect platform records...');

  // Check if admin already exists
  const existingAdmin = await DataStore.findUserByEmail('admin@legalconnect.com');
  if (existingAdmin) {
    console.log('Database already has seeded data. Skipping initial seeding.');
    return;
  }

  // Common password hashes
  const salt = await bcrypt.genSalt(10);
  const adminPassHash = await bcrypt.hash('AdminPass123!', salt);
  const lawyerPassHash = await bcrypt.hash('LawyerPass123!', salt);
  const clientPassHash = await bcrypt.hash('ClientPass123!', salt);

  // 1. Seed Legal Domains / Practice Categories
  const categories = [
    {
      name: 'Corporate & Commercial',
      slug: 'corporate-commercial',
      description: 'Business formation, contracts, M&A, regulatory compliance, and corporate governance.',
      icon: 'Briefcase',
      isPopular: true,
    },
    {
      name: 'Intellectual Property',
      slug: 'intellectual-property',
      description: 'Patents, trademarks, copyrights, trade secrets, and software licensing agreements.',
      icon: 'ShieldCheck',
      isPopular: true,
    },
    {
      name: 'Criminal Defense',
      slug: 'criminal-defense',
      description: 'White-collar investigations, bail applications, appeals, and courtroom representation.',
      icon: 'Scale',
      isPopular: true,
    },
    {
      name: 'Family & Matrimonial',
      slug: 'family-matrimonial',
      description: 'Divorce, child custody, marital agreements, probate, and domestic disputes.',
      icon: 'Users',
      isPopular: true,
    },
    {
      name: 'Real Estate & Property',
      slug: 'real-estate-property',
      description: 'Title deeds, land acquisition, lease agreements, tenancy conflicts, and zoning laws.',
      icon: 'Building',
      isPopular: true,
    },
    {
      name: 'Labor & Employment',
      slug: 'labor-employment',
      description: 'Workplace contracts, wrongful termination, severance negotiations, and labor compliance.',
      icon: 'FileText',
      isPopular: false,
    },
    {
      name: 'Cyber & Technology Law',
      slug: 'cyber-technology',
      description: 'Data privacy regulations, GDPR compliance, cyber fraud, and digital contracts.',
      icon: 'Cpu',
      isPopular: true,
    },
    {
      name: 'Taxation & Wealth Planning',
      slug: 'taxation-wealth',
      description: 'Direct & indirect taxes, corporate restructuring, estate planning, and tax appeals.',
      icon: 'DollarSign',
      isPopular: false,
    },
  ];

  for (const cat of categories) {
    await DataStore.createDomain(cat);
  }

  // 2. Seed Admin User
  const admin = await DataStore.createUser({
    name: 'Chief Compliance Officer (Admin)',
    email: 'admin@legalconnect.com',
    passwordHash: adminPassHash,
    role: 'admin',
    phone: '+1 (555) 019-2834',
    city: 'New York',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  // 3. Seed Client Users
  const client1 = await DataStore.createUser({
    name: 'Sarah Jenkins',
    email: 'client.sarah@example.com',
    passwordHash: clientPassHash,
    role: 'client',
    phone: '+1 (555) 234-5678',
    city: 'San Francisco',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  });

  const client2 = await DataStore.createUser({
    name: 'Michael Torres',
    email: 'client.michael@example.com',
    passwordHash: clientPassHash,
    role: 'client',
    phone: '+1 (555) 345-6789',
    city: 'Chicago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  });

  // 4. Seed Verified Demo Lawyers (Clearly flagged as demo data)
  const lawyerUser1 = await DataStore.createUser({
    name: 'Adv. Rajesh Sharma',
    email: 'rajesh.lawyer@example.com',
    passwordHash: lawyerPassHash,
    role: 'lawyer',
    phone: '+1 (555) 456-7890',
    city: 'New York',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  });

  const lawyer1 = await DataStore.createLawyer({
    userId: lawyerUser1._id,
    barRegistrationNumber: 'NY-BAR-2008-84910',
    barCouncilState: 'New York',
    yearOfAdmission: 2008,
    verificationStatus: 'approved',
    verificationNotes: 'Verified bar registration credentials with State Bar Registry. [Demo Record]',
    verificationDocuments: [
      {
        title: 'State Bar of New York Certificate of Good Standing',
        documentType: 'bar_license',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        verifiedAt: new Date(),
      },
    ],
    practiceAreas: ['Corporate & Commercial', 'Taxation & Wealth Planning', 'M&A Advisory'],
    primaryDomain: 'Corporate & Commercial',
    bio: 'Senior partner with over 16 years of courtroom and cross-border commercial advisory experience. Advised 80+ startups and corporate entities on joint ventures, venture financings, and regulatory compliance.',
    education: 'LL.M. Columbia Law School; B.A. LL.B. (Hons) NLSIU',
    experienceYears: 16,
    consultationFee: 180,
    consultationDurationMinutes: 45,
    officeAddress: 'Rockefeller Center, 45 Rockefeller Plaza, New York, NY 10111',
    city: 'New York',
    state: 'NY',
    languages: ['English', 'Hindi'],
    courtAdmissions: ['New York Supreme Court', 'U.S. District Court for the Southern District of New York'],
    rating: 4.9,
    reviewCount: 38,
    isAcceptingNewClients: true,
    isDemo: true,
  });

  const lawyerUser2 = await DataStore.createUser({
    name: 'Adv. Elena Rostova',
    email: 'elena.lawyer@example.com',
    passwordHash: lawyerPassHash,
    role: 'lawyer',
    phone: '+1 (555) 567-8901',
    city: 'San Francisco',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  });

  const lawyer2 = await DataStore.createLawyer({
    userId: lawyerUser2._id,
    barRegistrationNumber: 'CA-BAR-2012-49201',
    barCouncilState: 'California',
    yearOfAdmission: 2012,
    verificationStatus: 'approved',
    verificationNotes: 'Credentialed by California State Bar and USPTO. [Demo Record]',
    verificationDocuments: [
      {
        title: 'California State Bar Certificate & USPTO Registration',
        documentType: 'bar_license',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        verifiedAt: new Date(),
      },
    ],
    practiceAreas: ['Intellectual Property', 'Cyber & Technology Law', 'Software Licensing'],
    primaryDomain: 'Intellectual Property',
    bio: 'Specialist IP & Patent counsel representing technology ventures, AI innovators, and creators in trademark protection, copyright enforcement, and trade secret litigation before federal courts.',
    education: 'J.D. UC Berkeley School of Law; B.S. Computer Science Stanford',
    experienceYears: 12,
    consultationFee: 210,
    consultationDurationMinutes: 45,
    officeAddress: '555 California Street, Suite 3200, San Francisco, CA 94104',
    city: 'San Francisco',
    state: 'CA',
    languages: ['English', 'Spanish', 'Russian'],
    courtAdmissions: ['California Supreme Court', 'U.S. Court of Appeals for the Ninth Circuit', 'USPTO Bar'],
    rating: 5.0,
    reviewCount: 42,
    isAcceptingNewClients: true,
    isDemo: true,
  });

  const lawyerUser3 = await DataStore.createUser({
    name: 'Adv. Marcus Vance',
    email: 'marcus.lawyer@example.com',
    passwordHash: lawyerPassHash,
    role: 'lawyer',
    phone: '+1 (555) 678-9012',
    city: 'Chicago',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  });

  const lawyer3 = await DataStore.createLawyer({
    userId: lawyerUser3._id,
    barRegistrationNumber: 'IL-BAR-2004-11823',
    barCouncilState: 'Illinois',
    yearOfAdmission: 2004,
    verificationStatus: 'approved',
    verificationNotes: 'Verified bar standing with Supreme Court of Illinois. [Demo Record]',
    verificationDocuments: [
      {
        title: 'Illinois Supreme Court License to Practice Law',
        documentType: 'bar_license',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        verifiedAt: new Date(),
      },
    ],
    practiceAreas: ['Criminal Defense', 'Civil Rights', 'Appellate Advocacy'],
    primaryDomain: 'Criminal Defense',
    bio: 'Seasoned trial advocate with 20 years defending individuals in high-stakes white collar investigations, state felonies, and civil liberties appeals. Former public defender passionate about constitutional rights.',
    education: 'J.D. Northwestern Pritzker School of Law',
    experienceYears: 20,
    consultationFee: 195,
    consultationDurationMinutes: 45,
    officeAddress: 'One Prudential Plaza, 130 E Randolph St, Chicago, IL 60601',
    city: 'Chicago',
    state: 'IL',
    languages: ['English'],
    courtAdmissions: ['Illinois Supreme Court', 'U.S. Court of Appeals for the Seventh Circuit'],
    rating: 4.8,
    reviewCount: 29,
    isAcceptingNewClients: true,
    isDemo: true,
  });

  // 5. Seed a Lawyer in "pending" status to showcase Admin Verification workflow
  const pendingLawyerUser = await DataStore.createUser({
    name: 'Adv. Fatima Zahra',
    email: 'fatima.lawyer@example.com',
    passwordHash: lawyerPassHash,
    role: 'lawyer',
    phone: '+1 (555) 789-0123',
    city: 'Boston',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  });

  await DataStore.createLawyer({
    userId: pendingLawyerUser._id,
    barRegistrationNumber: 'MA-BAR-2018-99238',
    barCouncilState: 'Massachusetts',
    yearOfAdmission: 2018,
    verificationStatus: 'pending',
    verificationNotes: 'Bar enrollment verification document submitted. Awaiting Admin verification check.',
    verificationDocuments: [
      {
        title: 'Massachusetts Bar Admission Proof.pdf',
        documentType: 'bar_license',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      },
    ],
    practiceAreas: ['Labor & Employment', 'Civil Litigation'],
    primaryDomain: 'Labor & Employment',
    bio: 'Employment rights advocate representing employees and organizations in non-compete agreements, workplace claims, and executive compensation.',
    education: 'J.D. Boston University School of Law',
    experienceYears: 7,
    consultationFee: 140,
    consultationDurationMinutes: 45,
    officeAddress: '100 Federal Street, Boston, MA 02110',
    city: 'Boston',
    state: 'MA',
    languages: ['English', 'Arabic'],
    courtAdmissions: ['Massachusetts Supreme Judicial Court'],
    rating: 5.0,
    reviewCount: 0,
    isAcceptingNewClients: true,
    isDemo: true,
  });

  // 6. Seed Weekly Availability for Lawyers
  const workDays = [1, 2, 3, 4, 5]; // Mon - Fri
  for (const lawyer of [lawyer1, lawyer2, lawyer3]) {
    const slots = workDays.map((d) => ({
      dayOfWeek: d,
      startTime: '09:00',
      endTime: '17:00',
      slotDurationMinutes: 45,
      breakStartTime: '13:00',
      breakEndTime: '14:00',
      isAvailable: true,
      blockedDates: [],
    }));
    await DataStore.setAvailability(lawyer._id, slots);
  }

  // 7. Seed Appointments / Consultations (Various states: Completed, Confirmed, Requested)
  const completedApt = await DataStore.createAppointment({
    lawyerId: lawyer1._id,
    clientId: client1._id,
    clientName: client1.name,
    clientEmail: client1.email,
    lawyerName: lawyerUser1.name,
    lawyerEmail: lawyerUser1.email,
    legalDomainId: 'corporate-commercial',
    legalDomainName: 'Corporate & Commercial',
    appointmentDate: '2026-10-05',
    startTime: '10:00',
    endTime: '10:45',
    status: 'completed',
    consultationType: 'video',
    fee: 180,
    paymentStatus: 'paid',
    issueSummary:
      'Reviewing seed funding SAFE agreements and founder vesting restrictions for our upcoming B2B software venture.',
    clientQuestions: [
      'What are the customary pro-rata rights for angel investors?',
      'How do we structure standard 4-year founder vesting with a 1-year cliff?',
    ],
    lawyerNotes:
      'Advised on modifying clause 4.2 of the SAFE. Standard post-money safe template recommended. Founder share agreement draft requested.',
    actionItems: [
      'Revise indemnification clause in shareholder agreement',
      'Schedule follow-up cap table review',
    ],
    reviewedByClient: true,
  });

  const upcomingApt = await DataStore.createAppointment({
    lawyerId: lawyer2._id,
    clientId: client1._id,
    clientName: client1.name,
    clientEmail: client1.email,
    lawyerName: lawyerUser2.name,
    lawyerEmail: lawyerUser2.email,
    legalDomainId: 'intellectual-property',
    legalDomainName: 'Intellectual Property',
    appointmentDate: '2026-10-18',
    startTime: '14:00',
    endTime: '14:45',
    status: 'confirmed',
    consultationType: 'video',
    fee: 210,
    paymentStatus: 'paid',
    issueSummary:
      'Filing comprehensive trademark application for brand name and software logo across Classes 9 and 42.',
    clientQuestions: [
      'Is our trademark search clear of confusingly similar marks?',
      'Should we file internationally via Madrid Protocol right away?',
    ],
  });

  const requestedApt = await DataStore.createAppointment({
    lawyerId: lawyer3._id,
    clientId: client2._id,
    clientName: client2.name,
    clientEmail: client2.email,
    lawyerName: lawyerUser3.name,
    lawyerEmail: lawyerUser3.email,
    legalDomainId: 'criminal-defense',
    legalDomainName: 'Criminal Defense',
    appointmentDate: '2026-10-22',
    startTime: '11:00',
    endTime: '11:45',
    status: 'requested',
    consultationType: 'video',
    fee: 195,
    paymentStatus: 'paid',
    issueSummary:
      'Advisory regarding regulatory inquiries from financial authorities regarding digital asset transactions.',
    clientQuestions: ['What are the records retention obligations?'],
  });

  // 8. Seed Verified Review
  await DataStore.createReview({
    consultationId: completedApt._id,
    lawyerId: lawyer1._id,
    clientId: client1._id,
    clientName: 'Sarah Jenkins',
    rating: 5,
    title: 'Invaluable insight on our venture funding terms',
    comment:
      'Adv. Rajesh Sharma provided razor-sharp clarity on our SAFEs and cap table considerations. He spotted two risky clauses that could have cost us our controlling stake. Highly recommended!',
    isVerifiedConsultation: true,
    lawyerReply:
      'Thank you Sarah! It was a pleasure consulting with your team. Best wishes on the fundraising round.',
    lawyerRepliedAt: new Date(),
  });

  // 9. Seed Confidential Documents
  await DataStore.createDocument({
    title: 'Series_Seed_SAFE_Agreement_Draft.pdf',
    description: 'Term sheet and draft simple agreement for future equity shared for legal review.',
    documentType: 'agreement',
    fileType: 'application/pdf',
    fileSize: 420000,
    confidentialityLevel: 'lawyer_client_only',
    uploadedBy: client1._id,
    uploadedByName: client1.name,
    uploadedByRole: 'client',
    relatedAppointmentId: completedApt._id,
    relatedLawyerId: lawyer1._id,
    relatedClientId: client1._id,
  });

  await DataStore.createDocument({
    title: 'Consultation_Legal_Brief_Notes.pdf',
    description: 'Lawyer consultation notes and action items provided following the session.',
    documentType: 'client_brief',
    fileType: 'application/pdf',
    fileSize: 180000,
    confidentialityLevel: 'lawyer_client_only',
    uploadedBy: lawyerUser1._id,
    uploadedByName: lawyerUser1.name,
    uploadedByRole: 'lawyer',
    relatedAppointmentId: completedApt._id,
    relatedLawyerId: lawyer1._id,
    relatedClientId: client1._id,
  });

  // 10. Seed Notifications
  await DataStore.createNotification({
    recipientId: client1._id,
    title: 'Consultation Confirmed',
    message: `Your upcoming session with Adv. Elena Rostova on 2026-10-18 at 14:00 is confirmed.`,
    type: 'booking_confirmed',
    link: `/consultations/${upcomingApt._id}`,
  });

  await DataStore.createNotification({
    recipientId: lawyerUser1._id,
    title: 'Review Received (5/5)',
    message: 'Sarah Jenkins left a 5-star review for your Corporate & Commercial consultation.',
    type: 'review_received',
    link: '/reviews',
  });

  // 11. Seed Audit Logs
  await DataStore.createAuditLog({
    action: 'PLATFORM_INITIALIZED',
    actorId: admin._id,
    actorName: admin.name,
    actorRole: 'admin',
    targetResource: 'system',
    ipAddress: '127.0.0.1',
    details: { version: '1.0.0', seedRecordsCreated: true },
  });

  console.log('LegalConnect platform successfully seeded with demo data!');
}

// Allow direct execution: `node src/server/seed.ts` or `tsx src/server/seed.ts`
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
