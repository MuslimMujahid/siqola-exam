import {
  PrismaClient,
  Role,
  MembershipStatus,
} from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.answer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.examAssignment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.examTag.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.pendingRegistration.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Institutions
  console.log('🏢 Creating institutions...');
  const institutions = await Promise.all([
    prisma.institution.create({
      data: {
        name: 'Universitas Indonesia',
        address: 'Jl. Margonda Raya, Depok, Jawa Barat 16424',
        logo: null,
      },
    }),
    prisma.institution.create({
      data: {
        name: 'Institut Teknologi Bandung',
        address: 'Jl. Ganesha No.10, Bandung, Jawa Barat 40132',
        logo: null,
      },
    }),
    prisma.institution.create({
      data: {
        name: 'SMA Negeri 1 Jakarta',
        address: 'Jl. Budi Utomo No.7, Jakarta Pusat 10110',
        logo: null,
      },
    }),
    prisma.institution.create({
      data: {
        name: 'Bimbingan Belajar Neutron',
        address: 'Jl. Tebet Raya No.42, Jakarta Selatan 12810',
        logo: null,
      },
    }),
  ]);

  console.log(`✅ Created ${institutions.length} institutions`);

  // Create Users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    // Admins
    prisma.user.create({
      data: {
        email: 'admin.ui@example.com',
        password: hashedPassword,
        fullName: 'Dr. Budi Santoso',
        phoneNumber: '+628123456789',
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin.itb@example.com',
        password: hashedPassword,
        fullName: 'Prof. Siti Nurhaliza',
        phoneNumber: '+628234567890',
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin.sma1@example.com',
        password: hashedPassword,
        fullName: 'Drs. Ahmad Dahlan',
        phoneNumber: '+628345678901',
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin.neutron@example.com',
        password: hashedPassword,
        fullName: 'Ir. Lina Wijaya',
        phoneNumber: '+628456789012',
        role: Role.ADMIN,
      },
    }),
    // Examiners
    prisma.user.create({
      data: {
        email: 'examiner.math@example.com',
        password: hashedPassword,
        fullName: 'Dr. Andi Prasetyo',
        phoneNumber: '+628567890123',
        role: Role.EXAMINER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'examiner.physics@example.com',
        password: hashedPassword,
        fullName: 'Dr. Rini Kusuma',
        phoneNumber: '+628678901234',
        role: Role.EXAMINER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'examiner.chemistry@example.com',
        password: hashedPassword,
        fullName: 'Dr. Hendra Gunawan',
        phoneNumber: '+628789012345',
        role: Role.EXAMINER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'examiner.biology@example.com',
        password: hashedPassword,
        fullName: 'Dr. Maya Sari',
        phoneNumber: '+628890123456',
        role: Role.EXAMINER,
      },
    }),
    // Examinees
    prisma.user.create({
      data: {
        email: 'student1@example.com',
        password: hashedPassword,
        fullName: 'Rina Amelia',
        phoneNumber: '+628901234567',
        role: Role.EXAMINEE,
      },
    }),
    prisma.user.create({
      data: {
        email: 'student2@example.com',
        password: hashedPassword,
        fullName: 'Dimas Prakoso',
        phoneNumber: '+628012345678',
        role: Role.EXAMINEE,
      },
    }),
    prisma.user.create({
      data: {
        email: 'student3@example.com',
        password: hashedPassword,
        fullName: 'Sari Dewi',
        phoneNumber: '+628123456780',
        role: Role.EXAMINEE,
      },
    }),
    prisma.user.create({
      data: {
        email: 'student4@example.com',
        password: hashedPassword,
        fullName: 'Eko Prasetyo',
        phoneNumber: '+628234567891',
        role: Role.EXAMINEE,
      },
    }),
    prisma.user.create({
      data: {
        email: 'student5@example.com',
        password: hashedPassword,
        fullName: 'Fitri Handayani',
        phoneNumber: '+628345678902',
        role: Role.EXAMINEE,
      },
    }),
    prisma.user.create({
      data: {
        email: 'student6@example.com',
        password: hashedPassword,
        fullName: 'Arif Rahman',
        phoneNumber: '+628456789013',
        role: Role.EXAMINEE,
      },
    }),
    prisma.user.create({
      data: {
        email: 'student7@example.com',
        password: hashedPassword,
        fullName: 'Nurul Hidayah',
        phoneNumber: '+628567890124',
        role: Role.EXAMINEE,
      },
    }),
    prisma.user.create({
      data: {
        email: 'student8@example.com',
        password: hashedPassword,
        fullName: 'Yoga Pratama',
        phoneNumber: '+628678901235',
        role: Role.EXAMINEE,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Memberships
  console.log('🔗 Creating memberships...');
  const memberships = await Promise.all([
    // UI - Admin
    prisma.membership.create({
      data: {
        userId: users[0].id,
        institutionId: institutions[0].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // ITB - Admin
    prisma.membership.create({
      data: {
        userId: users[1].id,
        institutionId: institutions[1].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // SMA - Admin
    prisma.membership.create({
      data: {
        userId: users[2].id,
        institutionId: institutions[2].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // Neutron - Admin
    prisma.membership.create({
      data: {
        userId: users[3].id,
        institutionId: institutions[3].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // Math Examiner - UI and SMA
    prisma.membership.create({
      data: {
        userId: users[4].id,
        institutionId: institutions[0].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[4].id,
        institutionId: institutions[2].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // Physics Examiner - ITB
    prisma.membership.create({
      data: {
        userId: users[5].id,
        institutionId: institutions[1].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // Chemistry Examiner - UI
    prisma.membership.create({
      data: {
        userId: users[6].id,
        institutionId: institutions[0].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // Biology Examiner - Neutron
    prisma.membership.create({
      data: {
        userId: users[7].id,
        institutionId: institutions[3].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    // Students - Various institutions
    prisma.membership.create({
      data: {
        userId: users[8].id,
        institutionId: institutions[0].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[9].id,
        institutionId: institutions[0].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[10].id,
        institutionId: institutions[1].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[11].id,
        institutionId: institutions[1].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[12].id,
        institutionId: institutions[2].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[13].id,
        institutionId: institutions[2].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[14].id,
        institutionId: institutions[3].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[15].id,
        institutionId: institutions[3].id,
        status: MembershipStatus.ACTIVE,
      },
    }),
  ]);

  console.log(`✅ Created ${memberships.length} memberships`);

  // Create Groups
  console.log('📚 Creating groups...');
  const groups = await Promise.all([
    // UI Groups
    prisma.group.create({
      data: {
        institutionId: institutions[0].id,
        name: 'Kelas Matematika Lanjut',
        description: 'Kelas untuk mahasiswa semester 3 dan 4',
      },
    }),
    prisma.group.create({
      data: {
        institutionId: institutions[0].id,
        name: 'Kelas Kimia Dasar',
        description: 'Kelas kimia untuk mahasiswa semester 1',
      },
    }),
    // ITB Groups
    prisma.group.create({
      data: {
        institutionId: institutions[1].id,
        name: 'Fisika Kuantum',
        description: 'Kelas fisika kuantum tingkat lanjut',
      },
    }),
    prisma.group.create({
      data: {
        institutionId: institutions[1].id,
        name: 'Kalkulus I',
        description: 'Kelas kalkulus untuk mahasiswa baru',
      },
    }),
    // SMA Groups
    prisma.group.create({
      data: {
        institutionId: institutions[2].id,
        name: 'Kelas 12 IPA 1',
        description: 'Kelas 12 IPA 1 Tahun Ajaran 2024/2025',
      },
    }),
    prisma.group.create({
      data: {
        institutionId: institutions[2].id,
        name: 'Kelas 12 IPA 2',
        description: 'Kelas 12 IPA 2 Tahun Ajaran 2024/2025',
      },
    }),
    // Neutron Groups
    prisma.group.create({
      data: {
        institutionId: institutions[3].id,
        name: 'Intensif UTBK 2025',
        description: 'Kelas persiapan UTBK batch 1',
      },
    }),
    prisma.group.create({
      data: {
        institutionId: institutions[3].id,
        name: 'Super Intensif Saintek',
        description: 'Program super intensif untuk UTBK saintek',
      },
    }),
  ]);

  console.log(`✅ Created ${groups.length} groups`);

  // Create Group Members
  console.log('👨‍🎓 Creating group members...');
  const groupMembers = await Promise.all([
    // UI - Kelas Matematika Lanjut (Group 0)
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: users[8].id, // student1
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: users[9].id, // student2
      },
    }),
    // UI - Kelas Kimia Dasar (Group 1)
    prisma.groupMember.create({
      data: {
        groupId: groups[1].id,
        userId: users[8].id, // student1
      },
    }),
    // ITB - Fisika Kuantum (Group 2)
    prisma.groupMember.create({
      data: {
        groupId: groups[2].id,
        userId: users[10].id, // student3
      },
    }),
    // ITB - Kalkulus I (Group 3)
    prisma.groupMember.create({
      data: {
        groupId: groups[3].id,
        userId: users[10].id, // student3
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[3].id,
        userId: users[11].id, // student4
      },
    }),
    // SMA - Kelas 12 IPA 1 (Group 4)
    prisma.groupMember.create({
      data: {
        groupId: groups[4].id,
        userId: users[12].id, // student5
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[4].id,
        userId: users[13].id, // student6
      },
    }),
    // SMA - Kelas 12 IPA 2 (Group 5)
    prisma.groupMember.create({
      data: {
        groupId: groups[5].id,
        userId: users[12].id, // student5
      },
    }),
    // Neutron - Intensif UTBK (Group 6)
    prisma.groupMember.create({
      data: {
        groupId: groups[6].id,
        userId: users[14].id, // student7
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[6].id,
        userId: users[15].id, // student8
      },
    }),
    // Neutron - Super Intensif Saintek (Group 7)
    prisma.groupMember.create({
      data: {
        groupId: groups[7].id,
        userId: users[14].id, // student7
      },
    }),
  ]);

  console.log(`✅ Created ${groupMembers.length} group members`);

  // Create Tags
  console.log('🏷️  Creating tags...');
  const tags = await Promise.all([
    // Public tags (available to all institutions)
    prisma.tag.create({
      data: {
        name: 'Matematika',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Fisika',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Kimia',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Biologi',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Bahasa Inggris',
      },
    }),
    // Common exam types (public)
    prisma.tag.create({
      data: {
        name: 'UTS',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'UAS',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'UH',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Quiz',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Praktikum',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Ujian Semester',
      },
    }),
    // Institution-specific tags
    // UI tags
    prisma.tag.create({
      data: {
        name: 'Kalkulus',
        institutionId: institutions[0].id,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Organik',
        institutionId: institutions[0].id,
      },
    }),
    // ITB tags
    prisma.tag.create({
      data: {
        name: 'Kuantum',
        institutionId: institutions[1].id,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Aljabar Linear',
        institutionId: institutions[1].id,
      },
    }),
    // SMA tags
    prisma.tag.create({
      data: {
        name: 'Sel',
        institutionId: institutions[2].id,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Trigonometri',
        institutionId: institutions[2].id,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Hukum Newton',
        institutionId: institutions[2].id,
      },
    }),
    // Neutron tags
    prisma.tag.create({
      data: {
        name: 'UTBK',
        institutionId: institutions[3].id,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Saintek',
        institutionId: institutions[3].id,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Try Out',
        institutionId: institutions[3].id,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Pre-test',
        institutionId: institutions[3].id,
      },
    }),
  ]);

  console.log(
    `✅ Created ${tags.length} tags (${tags.filter((t) => !t.institutionId).length} public, ${tags.filter((t) => t.institutionId).length} institution-specific)`,
  );

  // Create Exams
  console.log('📝 Creating exams...');
  const exams = await Promise.all([
    // UI - Mathematics Exam (PUBLISHED)
    prisma.exam.create({
      data: {
        title: 'Ujian Matematika Lanjut - Kalkulus',
        description: 'Ujian tengah semester untuk mata kuliah Kalkulus',
        instructions:
          'Kerjakan semua soal dengan jujur. Waktu mengerjakan 90 menit. Dilarang membuka buku atau mencari di internet.',
        duration: 90,
        passingGrade: 70,
        shuffleOptions: true,
        maxAttempts: 2,
        institutionId: institutions[0].id,
        creatorId: users[4].id, // examiner.math
        status: 'PUBLISHED',
        availableFrom: new Date('2025-01-15T09:00:00'),
        availableUntil: new Date('2025-01-15T12:00:00'),
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Turunan pertama dari fungsi f(x) = 3x² + 2x - 1 adalah...',
                    },
                  ],
                },
              ],
              options: [
                { id: 'a', text: '6x + 2', isCorrect: true },
                { id: 'b', text: '3x + 2', isCorrect: false },
                { id: 'c', text: '6x - 2', isCorrect: false },
                { id: 'd', text: '3x² + 2', isCorrect: false },
              ],
              correctAnswer: ['a'],
              points: 10,
              order: 0,
            },
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Integral dari ∫2x dx adalah...' }],
                },
              ],
              options: [
                { id: 'a', text: 'x² + C', isCorrect: true },
                { id: 'b', text: '2x² + C', isCorrect: false },
                { id: 'c', text: 'x + C', isCorrect: false },
                { id: 'd', text: '2x + C', isCorrect: false },
              ],
              correctAnswer: ['a'],
              points: 10,
              order: 1,
            },
            {
              type: 'ESSAY',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Jelaskan konsep limit fungsi dan berikan contoh penerapannya dalam kehidupan sehari-hari.',
                    },
                  ],
                },
              ],
              points: 20,
              order: 2,
            },
          ],
        },
      },
    }),
    // ITB - Physics Exam (PUBLISHED)
    prisma.exam.create({
      data: {
        title: 'Ujian Fisika Kuantum',
        description: 'Ujian akhir semester Fisika Kuantum',
        instructions:
          'Baca soal dengan teliti. Tunjukkan langkah-langkah pengerjaan dengan jelas.',
        duration: 120,
        passingGrade: 75,
        shuffleOptions: false,
        maxAttempts: 1,
        institutionId: institutions[1].id,
        creatorId: users[5].id, // examiner.physics
        status: 'PUBLISHED',
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    { text: 'Konstanta Planck memiliki nilai sebesar...' },
                  ],
                },
              ],
              options: [
                { id: 'a', text: '6.626 × 10⁻³⁴ J·s', isCorrect: true },
                { id: 'b', text: '3.14 × 10⁻³⁴ J·s', isCorrect: false },
                { id: 'c', text: '9.8 × 10⁻³⁴ J·s', isCorrect: false },
                { id: 'd', text: '1.6 × 10⁻³⁴ J·s', isCorrect: false },
              ],
              correctAnswer: ['a'],
              points: 15,
              order: 0,
            },
            {
              type: 'SHORT_ANSWER',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    { text: 'Sebutkan prinsip ketidakpastian Heisenberg.' },
                  ],
                },
              ],
              points: 25,
              order: 1,
            },
          ],
        },
      },
    }),
    // SMA - Biology Draft Exam (DRAFT)
    prisma.exam.create({
      data: {
        title: 'Ulangan Harian Biologi - Sel',
        description: 'Ulangan harian tentang struktur dan fungsi sel',
        instructions: 'Kerjakan dengan jujur dan teliti',
        duration: 60,
        passingGrade: 70,
        shuffleOptions: true,
        maxAttempts: 1,
        institutionId: institutions[2].id,
        creatorId: users[7].id, // examiner.biology
        status: 'DRAFT',
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Organel yang berfungsi sebagai pusat kontrol sel adalah...',
                    },
                  ],
                },
              ],
              options: [
                { id: 'a', text: 'Nukleus', isCorrect: true },
                { id: 'b', text: 'Mitokondria', isCorrect: false },
                { id: 'c', text: 'Ribosom', isCorrect: false },
                { id: 'd', text: 'Lisosom', isCorrect: false },
              ],
              correctAnswer: ['a'],
              points: 10,
              order: 0,
            },
          ],
        },
      },
    }),
    // UI - Chemistry Exam (PUBLISHED)
    prisma.exam.create({
      data: {
        title: 'Quiz Kimia Organik - Hidrokarbon',
        description: 'Kuis singkat tentang hidrokarbon dan turunannya',
        instructions: 'Waktu 45 menit. Kerjakan dengan cepat dan tepat.',
        duration: 45,
        passingGrade: 65,
        shuffleOptions: true,
        maxAttempts: 1,
        institutionId: institutions[0].id,
        creatorId: users[6].id, // examiner.chemistry
        status: 'PUBLISHED',
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Rumus umum alkana adalah...',
                    },
                  ],
                },
              ],
              options: [
                { id: 'a', text: 'CnH2n+2', isCorrect: true },
                { id: 'b', text: 'CnH2n', isCorrect: false },
                { id: 'c', text: 'CnH2n-2', isCorrect: false },
                { id: 'd', text: 'CnHn', isCorrect: false },
              ],
              correctAnswer: ['a'],
              points: 20,
              order: 0,
            },
            {
              type: 'SHORT_ANSWER',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Sebutkan 3 contoh alkana dan kegunaannya.',
                    },
                  ],
                },
              ],
              points: 30,
              order: 1,
            },
          ],
        },
      },
    }),
    // SMA - Math Exam (CLOSED)
    prisma.exam.create({
      data: {
        title: 'Ujian Matematika - Trigonometri',
        description: 'Ujian semester ganjil tentang trigonometri',
        instructions: 'Tunjukkan cara pengerjaan dengan lengkap',
        duration: 90,
        passingGrade: 70,
        shuffleOptions: false,
        maxAttempts: 1,
        institutionId: institutions[2].id,
        creatorId: users[4].id, // examiner.math
        status: 'CLOSED',
        availableFrom: new Date('2024-12-10T08:00:00'),
        availableUntil: new Date('2024-12-10T10:00:00'),
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Nilai sin 30° adalah...',
                    },
                  ],
                },
              ],
              options: [
                { id: 'a', text: '1/2', isCorrect: true },
                { id: 'b', text: '1/2√3', isCorrect: false },
                { id: 'c', text: '1/2√2', isCorrect: false },
                { id: 'd', text: '√3/2', isCorrect: false },
              ],
              correctAnswer: ['a'],
              points: 10,
              order: 0,
            },
          ],
        },
      },
    }),
    // Neutron - UTBK Mock Test (PUBLISHED)
    prisma.exam.create({
      data: {
        title: 'Try Out UTBK 2025 - Saintek',
        description: 'Simulasi UTBK untuk jurusan Saintek',
        instructions:
          'Simulasi ini mengikuti format UTBK asli. Kerjakan dengan kondisi ujian sebenarnya.',
        duration: 180,
        passingGrade: 600,
        shuffleOptions: true,
        maxAttempts: 3,
        institutionId: institutions[3].id,
        creatorId: users[7].id, // examiner.biology
        status: 'PUBLISHED',
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Fotosintesis menghasilkan...',
                    },
                  ],
                },
              ],
              options: [
                { id: 'a', text: 'Glukosa dan oksigen', isCorrect: true },
                { id: 'b', text: 'Karbondioksida dan air', isCorrect: false },
                { id: 'c', text: 'ATP dan NADPH', isCorrect: false },
                { id: 'd', text: 'Protein dan lemak', isCorrect: false },
              ],
              correctAnswer: ['a'],
              points: 5,
              order: 0,
            },
          ],
        },
      },
    }),
    // Neutron - English Test (DRAFT)
    prisma.exam.create({
      data: {
        title: 'Tes Kemampuan Bahasa Inggris',
        description: 'Pre-test untuk mengetahui level kemampuan bahasa Inggris',
        instructions: 'Jawab sesuai kemampuan Anda tanpa bantuan kamus',
        duration: 60,
        passingGrade: 60,
        shuffleOptions: true,
        maxAttempts: 1,
        institutionId: institutions[3].id,
        creatorId: users[7].id, // examiner.biology (acting as English examiner)
        status: 'DRAFT',
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Choose the correct sentence:',
                    },
                  ],
                },
              ],
              options: [
                {
                  id: 'a',
                  text: 'She has been living here since 2020',
                  isCorrect: true,
                },
                {
                  id: 'b',
                  text: 'She has been live here since 2020',
                  isCorrect: false,
                },
                {
                  id: 'c',
                  text: 'She has living here since 2020',
                  isCorrect: false,
                },
                {
                  id: 'd',
                  text: 'She have been living here since 2020',
                  isCorrect: false,
                },
              ],
              correctAnswer: ['a'],
              points: 10,
              order: 0,
            },
          ],
        },
      },
    }),
    // ITB - Advanced Math (PUBLISHED)
    prisma.exam.create({
      data: {
        title: 'Ujian Aljabar Linear',
        description: 'Ujian mid untuk mata kuliah Aljabar Linear',
        instructions:
          'Gunakan teorema yang telah dipelajari untuk membuktikan jawaban',
        duration: 120,
        passingGrade: 75,
        shuffleOptions: false,
        maxAttempts: 1,
        institutionId: institutions[1].id,
        creatorId: users[4].id, // examiner.math
        status: 'PUBLISHED',
        questions: {
          create: [
            {
              type: 'ESSAY',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Buktikan bahwa transformasi linear T: R³ → R² yang didefinisikan sebagai T(x,y,z) = (x+y, y-z) adalah linear.',
                    },
                  ],
                },
              ],
              points: 50,
              order: 0,
            },
          ],
        },
      },
    }),
    // SMA - Physics Practical (DRAFT)
    prisma.exam.create({
      data: {
        title: 'Praktikum Fisika - Hukum Newton',
        description: 'Laporan praktikum tentang hukum Newton',
        instructions: 'Upload laporan praktikum dalam format PDF',
        duration: 120,
        passingGrade: 70,
        shuffleOptions: false,
        maxAttempts: 2,
        institutionId: institutions[2].id,
        creatorId: users[5].id, // examiner.physics
        status: 'DRAFT',
        questions: {
          create: [
            {
              type: 'ESSAY',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Jelaskan hasil eksperimen Anda dan bagaimana hal tersebut membuktikan Hukum Newton II.',
                    },
                  ],
                },
              ],
              points: 100,
              order: 0,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${exams.length} exams`);

  // Create Exam-Tag relationships
  console.log('🔗 Creating exam-tag relationships...');

  // Helper function to find tag by name
  const findTag = (name: string) => tags.find((t) => t.name === name);

  const examTags = await Promise.all([
    // Math exam: Matematika, Kalkulus, UTS
    prisma.examTag.create({
      data: { examId: exams[0].id, tagId: findTag('Matematika')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[0].id, tagId: findTag('Kalkulus')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[0].id, tagId: findTag('UTS')!.id },
    }),

    // Physics exam: Fisika, Kuantum, UAS
    prisma.examTag.create({
      data: { examId: exams[1].id, tagId: findTag('Fisika')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[1].id, tagId: findTag('Kuantum')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[1].id, tagId: findTag('UAS')!.id },
    }),

    // Biology exam: Biologi, Sel, UH
    prisma.examTag.create({
      data: { examId: exams[2].id, tagId: findTag('Biologi')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[2].id, tagId: findTag('Sel')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[2].id, tagId: findTag('UH')!.id },
    }),

    // Chemistry exam: Kimia, Organik, Quiz
    prisma.examTag.create({
      data: { examId: exams[3].id, tagId: findTag('Kimia')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[3].id, tagId: findTag('Organik')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[3].id, tagId: findTag('Quiz')!.id },
    }),

    // Trigonometry exam: Matematika, Trigonometri, Ujian Semester
    prisma.examTag.create({
      data: { examId: exams[4].id, tagId: findTag('Matematika')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[4].id, tagId: findTag('Trigonometri')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[4].id, tagId: findTag('Ujian Semester')!.id },
    }),

    // UTBK exam: UTBK, Saintek, Try Out
    prisma.examTag.create({
      data: { examId: exams[5].id, tagId: findTag('UTBK')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[5].id, tagId: findTag('Saintek')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[5].id, tagId: findTag('Try Out')!.id },
    }),

    // English test: Bahasa Inggris, Pre-test
    prisma.examTag.create({
      data: { examId: exams[6].id, tagId: findTag('Bahasa Inggris')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[6].id, tagId: findTag('Pre-test')!.id },
    }),

    // Algebra exam: Matematika, Aljabar Linear, UTS
    prisma.examTag.create({
      data: { examId: exams[7].id, tagId: findTag('Matematika')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[7].id, tagId: findTag('Aljabar Linear')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[7].id, tagId: findTag('UTS')!.id },
    }),

    // Physics practical: Fisika, Praktikum, Hukum Newton
    prisma.examTag.create({
      data: { examId: exams[8].id, tagId: findTag('Fisika')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[8].id, tagId: findTag('Praktikum')!.id },
    }),
    prisma.examTag.create({
      data: { examId: exams[8].id, tagId: findTag('Hukum Newton')!.id },
    }),
  ]);

  console.log(`✅ Created ${examTags.length} exam-tag relationships`);

  // Create Exam Assignments
  console.log('📋 Creating exam assignments...');
  const examAssignments = await Promise.all([
    // Assign Math exam to group
    prisma.examAssignment.create({
      data: {
        examId: exams[0].id,
        groupId: groups[0].id, // Kelas Matematika Lanjut
        availableFrom: new Date('2025-01-15T09:00:00'),
        availableUntil: new Date('2025-01-15T12:00:00'),
      },
    }),
    // Assign Physics exam to group
    prisma.examAssignment.create({
      data: {
        examId: exams[1].id,
        groupId: groups[2].id, // Fisika Kuantum
      },
    }),
    // Assign individual student to Math exam
    prisma.examAssignment.create({
      data: {
        examId: exams[0].id,
        userId: users[9].id, // student2
      },
    }),
  ]);

  console.log(`✅ Created ${examAssignments.length} exam assignments`);

  // Get the questions for creating answers
  const mathExamQuestions = await prisma.question.findMany({
    where: { examId: exams[0].id },
    orderBy: { order: 'asc' },
  });

  // Create some exam attempts
  console.log('📊 Creating exam attempts...');
  const attempts = await Promise.all([
    // Student1 completes Math exam
    prisma.examAttempt.create({
      data: {
        examId: exams[0].id,
        userId: users[8].id, // student1
        status: 'COMPLETED',
        startedAt: new Date('2025-01-15T09:05:00'),
        completedAt: new Date('2025-01-15T10:20:00'),
        score: 85,
        answers: {
          create: [
            {
              questionId: mathExamQuestions[0].id,
              answerContent: ['a'],
              score: 10,
            },
            {
              questionId: mathExamQuestions[1].id,
              answerContent: ['a'],
              score: 10,
            },
            {
              questionId: mathExamQuestions[2].id,
              answerContent:
                'Limit adalah nilai yang didekati suatu fungsi saat variabelnya mendekati suatu titik tertentu. Contoh: kecepatan sesaat adalah limit dari kecepatan rata-rata.',
              score: 14,
              feedback:
                'Jawaban bagus, sudah mencakup konsep dasar dan contoh.',
            },
          ],
        },
      },
    }),
    // Student2 in progress
    prisma.examAttempt.create({
      data: {
        examId: exams[0].id,
        userId: users[9].id, // student2
        status: 'IN_PROGRESS',
        startedAt: new Date('2025-01-15T09:10:00'),
      },
    }),
  ]);

  console.log(`✅ Created ${attempts.length} exam attempts`);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${institutions.length} institutions`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${memberships.length} memberships`);
  console.log(`   - ${groups.length} groups`);
  console.log(`   - ${groupMembers.length} group members`);
  console.log(`   - ${tags.length} tags`);
  console.log(
    `     • ${tags.filter((t) => !t.institutionId).length} Public tags`,
  );
  console.log(
    `     • ${tags.filter((t) => t.institutionId).length} Institution-specific tags`,
  );
  console.log(`   - ${exams.length} exams`);
  console.log(
    `     • ${exams.filter((e) => e.status === 'PUBLISHED').length} Published`,
  );
  console.log(
    `     • ${exams.filter((e) => e.status === 'DRAFT').length} Draft`,
  );
  console.log(
    `     • ${exams.filter((e) => e.status === 'CLOSED').length} Closed`,
  );
  console.log(`   - ${examTags.length} exam-tag relationships`);
  console.log(`   - ${examAssignments.length} exam assignments`);
  console.log(`   - ${attempts.length} exam attempts`);
  console.log('\n🔑 Default password for all users: password123');
  console.log('\n👥 Sample users:');
  console.log('   Admin UI: admin.ui@example.com');
  console.log('   Admin ITB: admin.itb@example.com');
  console.log('   Examiner Math: examiner.math@example.com');
  console.log('   Examiner Physics: examiner.physics@example.com');
  console.log('   Examiner Chemistry: examiner.chemistry@example.com');
  console.log('   Examiner Biology: examiner.biology@example.com');
  console.log('   Student: student1@example.com');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
