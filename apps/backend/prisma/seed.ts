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

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${institutions.length} institutions`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${memberships.length} memberships`);
  console.log(`   - ${groups.length} groups`);
  console.log(`   - ${groupMembers.length} group members`);
  console.log('\n🔑 Default password for all users: password123');
  console.log('\n👥 Sample users:');
  console.log('   Admin UI: admin.ui@example.com');
  console.log('   Admin ITB: admin.itb@example.com');
  console.log('   Examiner Math: examiner.math@example.com');
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
