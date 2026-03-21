import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 39-maktab o'qituvchilari
const TEACHERS_39_SCHOOL = [
  { login: 'achilova', name: 'Achilova Gulnoza Mirzakulovna' },
  { login: 'achilova2', name: 'Achilova Rano Xamidovna' },
  { login: 'achilova3', name: 'Achilova Zuxra Xudayberdiyevna' },
  { login: 'akramova', name: 'Akramova Sabina Ilxomjon qizi' },
  { login: 'alijanov', name: 'Alijanov Sherzod Valijonovich' },
  { login: 'alikulov', name: 'Alikulov Odil Davronovich' },
  { login: 'alikulova', name: 'Alikulova Umida Nafasovna' },
  { login: 'arakulov', name: 'Arakulov Jahongir Xudoykul o\'g\'li' },
  { login: 'aripova', name: 'Aripova Mavluda Kabilovna' },
  { login: 'axmedova', name: 'Axmedova Gulandan Muxamedjanovna' },
  { login: 'azizov', name: 'Azizov Ravshan A\'zamjon o\'g\'li' },
  { login: 'bektemirova', name: 'Bektemirova Dilnoza Saidbotir qizi' },
  { login: 'dexxomova', name: 'Dexxomova Layloxon Solivaliyevna' },
  { login: 'djurayeva', name: 'Djurayeva Diana Abdulbayevna' },
  { login: 'egamqulov', name: 'Egamqulov Doniyor Umidjon o\'g\'li' },
  { login: 'eshonkulova', name: 'Eshonkulova Ra\'no Abduraxmanovna' },
  { login: 'fazilova', name: 'Fazilova Guzal Usmonjonovna' },
  { login: 'gayimnazirova', name: 'Gayimnazirova Sabina Botir qizi' },
  { login: 'hamidova', name: 'Hamidova O\'g\'iloy Mirzoqul qizi' },
  { login: 'ikromova', name: 'Ikromova Iroda Rustamjon qizi' },
  { login: 'jonzakova', name: 'Jonzakova Dilfuza Abdulkasimovna' },
  { login: 'kaxxarov', name: 'Kaxxarov Xusan Madaminovich' },
  { login: 'kuralov', name: 'Kuralov Sojida Absamatovna' },
  { login: 'mamadaminova', name: 'Mamadaminova Muxayyo Nematjonovna' },
  { login: 'mamirova', name: 'Mamirova Nazira Gaybullayevna' },
  { login: 'maxmudov', name: 'Maxmudov Elbek Baxtiyor o\'g\'li' },
  { login: 'mirzaqosimov', name: 'Mirzaqosimov Javlon Nodir o\'g\'li' },
  { login: 'musurmanova', name: 'Musurmanova Dilnoza Furkatovna' },
  { login: 'muxamedov', name: 'Muxamedov Islombek Ilhom o\'g\'li' },
  { login: 'ochilova', name: 'Ochilova Sohiba Alisher qizi' },
  { login: 'oripova', name: 'Oripova Adolat Artikulovna' },
  { login: 'pirnazarov', name: 'Pirnazarov Abdumunnab Abdullayevich' },
  { login: 'primova', name: 'Primova Zulfiya Shirinkulovna' },
  { login: 'qoylibayev', name: 'Qo\'ylibayev Zuxriddin Karimjon o\'g\'li' },
  { login: 'qosimova', name: 'Qosimova Nigora Akmal qizi' },
  { login: 'radijapova', name: 'Radijapova Manzura Abduraximovna' },
  { login: 'rizoyeva', name: 'Rizoyeva Manzuraxon Xakimjon qizi' },
  { login: 'sabirova', name: 'Sabirova Natalya Nikolayevna' },
  { login: 'saidov', name: 'Saidov Alisher Xolbekovich' },
  { login: 'saidova', name: 'Saidova Nesipgul' },
  { login: 'saidova2', name: 'Saidova Umida Xolbekovna' },
  { login: 'saparova', name: 'Saparova Zarema Abdukarimovna' },
  { login: 'shamenova', name: 'Shamenova Saltanat Mukatirova qizi' },
  { login: 'sharikova', name: 'Sharikova Tatyana Vladimirovna' },
  { login: 'sherov', name: 'Sherov Dilmurod Kuvandikovich' },
  { login: 'tillavova', name: 'Tillavova Dianna Muxamedovna' },
  { login: 'tugalova', name: 'Tugalova Emine Ziyadinovna' },
  { login: 'tugalova2', name: 'Tugalova Liliya Shevketovna' },
  { login: 'turgunboyeva', name: 'Turg\'unboyeva Durdona Shuxrat qizi' },
  { login: 'tuvalova', name: 'Tuvalova Gulnoza Batirovna' },
  { login: 'ubaydullayeva', name: 'Ubaydullayeva Sitora Xamidullo qizi' },
  { login: 'vaxidova', name: 'Vaxidova Svetlana Samadovna' },
  { login: 'xakimova', name: 'Xakimova Dilshoda Farqat qizi' },
  { login: 'xamrabayeva', name: 'Xamrabayeva Lola Mamajon qizi' },
  { login: 'xamroboyev', name: 'Xamroboyev Nozim Nasimjonovich' },
  { login: 'xaydarova', name: 'Xaydarova Ramilya Muxamatshamirovna' },
  { login: 'xershko', name: 'Xershko Emine Fikriyevna' },
  { login: 'xodjayeva', name: 'Xodjayeva Dildora Abdugaparovna' },
  { login: 'xudaykulova', name: 'Xudaykulova Umida Alibekovna' },
  { login: 'yulchiyev', name: 'Yulchiyev Baxtiyar Zokirjonovich' },
  { login: 'yuldasheva', name: 'Yuldasheva Xalkiz Kantureyevna' },
  { login: 'yusufov', name: 'Yusufov Shaxzod Shavkat o\'g\'li' },
  { login: 'zakirayeva', name: 'Zakirayeva Sharofat Safarovna' },
  { login: 'zuldayeva', name: 'Zuldayeva Elmira Usmanovna' },
]

const DEFAULT_PASSWORD = '0987654321'

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create admin user
  const admin = await prisma.user.upsert({
    where: { login: 'ToHa_012' },
    update: {},
    create: {
      login: 'ToHa_012',
      password: 'tox1c___',
      name: 'Bosh Admin',
      role: 'admin',
    },
  })
  console.log('✅ Admin created:', admin.login)

  // 2. Create school "39-maktab"
  const school39 = await prisma.school.upsert({
    where: { id: 'school_39' },
    update: {},
    create: {
      id: 'school_39',
      name: '39-maktab',
      address: '',
    },
  })
  console.log('✅ School created:', school39.name)

  // 3. Create director user
  const directorUser = await prisma.user.upsert({
    where: { login: 'director39' },
    update: {},
    create: {
      login: 'director39',
      password: DEFAULT_PASSWORD,
      name: '39-maktab Direktori',
      role: 'director',
    },
  })
  console.log('✅ Director user created:', directorUser.login)

  // 4. Create director record
  const director = await prisma.director.upsert({
    where: { id: 'director_39' },
    update: {},
    create: {
      id: 'director_39',
      userId: directorUser.id,
      schoolId: school39.id,
    },
  })
  console.log('✅ Director record created')

  // 5. Create default classes for 39-maktab
  const classNames = [
    '1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B',
    '5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B',
    '9-A', '9-B', '10-A', '10-B', '11-A', '11-B',
  ]

  for (const className of classNames) {
    await prisma.class.upsert({
      where: { id: `class_${className.replace('-', '')}` },
      update: {},
      create: {
        id: `class_${className.replace('-', '')}`,
        name: className,
        schoolId: school39.id,
      },
    })
  }
  console.log('✅ Classes created:', classNames.length)

  // 6. Create all teachers
  let teacherCount = 0
  for (let i = 0; i < TEACHERS_39_SCHOOL.length; i++) {
    const t = TEACHERS_39_SCHOOL[i]
    
    // Create user
    const user = await prisma.user.upsert({
      where: { login: t.login },
      update: {},
      create: {
        login: t.login,
        password: DEFAULT_PASSWORD,
        name: t.name,
        role: 'teacher',
      },
    })

    // Create teacher record
    await prisma.teacher.upsert({
      where: { id: `teacher_${i + 1}` },
      update: {},
      create: {
        id: `teacher_${i + 1}`,
        userId: user.id,
        directorId: director.id,
        subject: 'Umumiy',
      },
    })
    teacherCount++
  }
  console.log('✅ Teachers created:', teacherCount)

  console.log('🎉 Seeding completed!')
  console.log('')
  console.log('📋 Login credentials:')
  console.log('  Admin: ToHa_012 / tox1c___')
  console.log('  Director: director39 / 0987654321')
  console.log('  Teachers: [login] / 0987654321')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
