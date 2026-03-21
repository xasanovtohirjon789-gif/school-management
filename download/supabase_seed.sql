-- Run this SQL in Supabase SQL Editor

-- Schools table
CREATE TABLE IF NOT EXISTS "School" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "address" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "login" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Directors table
CREATE TABLE IF NOT EXISTS "Director" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"("id"),
  "schoolId" TEXT NOT NULL REFERENCES "School"("id"),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS "Class" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL REFERENCES "School"("id"),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS "Teacher" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"("id"),
  "directorId" TEXT NOT NULL REFERENCES "Director"("id"),
  "subject" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS "Student" (
  "id" TEXT PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "middleName" TEXT,
  "classId" TEXT NOT NULL REFERENCES "Class"("id"),
  "coins" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ClassTeacher junction table
CREATE TABLE IF NOT EXISTS "ClassTeacher" (
  "id" TEXT PRIMARY KEY,
  "classId" TEXT NOT NULL REFERENCES "Class"("id"),
  "teacherId" TEXT NOT NULL REFERENCES "Teacher"("id"),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("classId", "teacherId")
);

-- Coin transactions table
CREATE TABLE IF NOT EXISTS "CoinTransaction" (
  "id" TEXT PRIMARY KEY,
  "studentId" TEXT NOT NULL REFERENCES "Student"("id"),
  "teacherId" TEXT NOT NULL REFERENCES "Teacher"("id"),
  "amount" INTEGER NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Insert Admin
INSERT INTO "User" (id, login, password, role, name) 
VALUES ('admin', 'ToHa_012', 'tox1c___', 'admin', 'Bosh Admin')
ON CONFLICT (login) DO NOTHING;

-- Insert School 39
INSERT INTO "School" (id, name, address) 
VALUES ('school_39', '39-maktab', '')
ON CONFLICT (id) DO NOTHING;

-- Insert Director User
INSERT INTO "User" (id, login, password, role, name) 
VALUES ('director_39_user', 'director39', '0987654321', 'director', '39-maktab Direktori')
ON CONFLICT (login) DO NOTHING;

-- Insert Director
INSERT INTO "Director" (id, "userId", "schoolId") 
VALUES ('director_39', 'director_39_user', 'school_39')
ON CONFLICT (id) DO NOTHING;

-- Insert Classes
INSERT INTO "Class" (id, name, "schoolId") VALUES
('class_1A', '1-A', 'school_39'),
('class_1B', '1-B', 'school_39'),
('class_2A', '2-A', 'school_39'),
('class_2B', '2-B', 'school_39'),
('class_3A', '3-A', 'school_39'),
('class_3B', '3-B', 'school_39'),
('class_4A', '4-A', 'school_39'),
('class_4B', '4-B', 'school_39'),
('class_5A', '5-A', 'school_39'),
('class_5B', '5-B', 'school_39'),
('class_6A', '6-A', 'school_39'),
('class_6B', '6-B', 'school_39'),
('class_7A', '7-A', 'school_39'),
('class_7B', '7-B', 'school_39'),
('class_8A', '8-A', 'school_39'),
('class_8B', '8-B', 'school_39'),
('class_9A', '9-A', 'school_39'),
('class_9B', '9-B', 'school_39'),
('class_10A', '10-A', 'school_39'),
('class_10B', '10-B', 'school_39'),
('class_11A', '11-A', 'school_39'),
('class_11B', '11-B', 'school_39')
ON CONFLICT (id) DO NOTHING;

-- Insert Teachers (64 teachers)
INSERT INTO "User" (id, login, password, role, name) VALUES
('t1', 'achilova', '0987654321', 'teacher', 'Achilova Gulnoza Mirzakulovna'),
('t2', 'achilova2', '0987654321', 'teacher', 'Achilova Rano Xamidovna'),
('t3', 'achilova3', '0987654321', 'teacher', 'Achilova Zuxra Xudayberdiyevna'),
('t4', 'akramova', '0987654321', 'teacher', 'Akramova Sabina Ilxomjon qizi'),
('t5', 'alijanov', '0987654321', 'teacher', 'Alijanov Sherzod Valijonovich'),
('t6', 'alikulov', '0987654321', 'teacher', 'Alikulov Odil Davronovich'),
('t7', 'alikulova', '0987654321', 'teacher', 'Alikulova Umida Nafasovna'),
('t8', 'arakulov', '0987654321', 'teacher', 'Arakulov Jahongir Xudoykul o''g''li'),
('t9', 'aripova', '0987654321', 'teacher', 'Aripova Mavluda Kabilovna'),
('t10', 'axmedova', '0987654321', 'teacher', 'Axmedova Gulandan Muxamedjanovna'),
('t11', 'azizov', '0987654321', 'teacher', 'Azizov Ravshan A''zamjon o''g''li'),
('t12', 'bektemirova', '0987654321', 'teacher', 'Bektemirova Dilnoza Saidbotir qizi'),
('t13', 'dexxomova', '0987654321', 'teacher', 'Dexxomova Layloxon Solivaliyevna'),
('t14', 'djurayeva', '0987654321', 'teacher', 'Djurayeva Diana Abdulbayevna'),
('t15', 'egamqulov', '0987654321', 'teacher', 'Egamqulov Doniyor Umidjon o''g''li'),
('t16', 'eshonkulova', '0987654321', 'teacher', 'Eshonkulova Ra''no Abduraxmanovna'),
('t17', 'fazilova', '0987654321', 'teacher', 'Fazilova Guzal Usmonjonovna'),
('t18', 'gayimnazirova', '0987654321', 'teacher', 'Gayimnazirova Sabina Botir qizi'),
('t19', 'hamidova', '0987654321', 'teacher', 'Hamidova O''g''iloy Mirzoqul qizi'),
('t20', 'ikromova', '0987654321', 'teacher', 'Ikromova Iroda Rustamjon qizi'),
('t21', 'jonzakova', '0987654321', 'teacher', 'Jonzakova Dilfuza Abdulkasimovna'),
('t22', 'kaxxarov', '0987654321', 'teacher', 'Kaxxarov Xusan Madaminovich'),
('t23', 'kuralov', '0987654321', 'teacher', 'Kuralov Sojida Absamatovna'),
('t24', 'mamadaminova', '0987654321', 'teacher', 'Mamadaminova Muxayyo Nematjonovna'),
('t25', 'mamirova', '0987654321', 'teacher', 'Mamirova Nazira Gaybullayevna'),
('t26', 'maxmudov', '0987654321', 'teacher', 'Maxmudov Elbek Baxtiyor o''g''li'),
('t27', 'mirzaqosimov', '0987654321', 'teacher', 'Mirzaqosimov Javlon Nodir o''g''li'),
('t28', 'musurmanova', '0987654321', 'teacher', 'Musurmanova Dilnoza Furkatovna'),
('t29', 'muxamedov', '0987654321', 'teacher', 'Muxamedov Islombek Ilhom o''g''li'),
('t30', 'ochilova', '0987654321', 'teacher', 'Ochilova Sohiba Alisher qizi'),
('t31', 'oripova', '0987654321', 'teacher', 'Oripova Adolat Artikulovna'),
('t32', 'pirnazarov', '0987654321', 'teacher', 'Pirnazarov Abdumunnab Abdullayevich'),
('t33', 'primova', '0987654321', 'teacher', 'Primova Zulfiya Shirinkulovna'),
('t34', 'qoylibayev', '0987654321', 'teacher', 'Qo''ylibayev Zuxriddin Karimjon o''g''li'),
('t35', 'qosimova', '0987654321', 'teacher', 'Qosimova Nigora Akmal qizi'),
('t36', 'radijapova', '0987654321', 'teacher', 'Radijapova Manzura Abduraximovna'),
('t37', 'rizoyeva', '0987654321', 'teacher', 'Rizoyeva Manzuraxon Xakimjon qizi'),
('t38', 'sabirova', '0987654321', 'teacher', 'Sabirova Natalya Nikolayevna'),
('t39', 'saidov', '0987654321', 'teacher', 'Saidov Alisher Xolbekovich'),
('t40', 'saidova', '0987654321', 'teacher', 'Saidova Nesipgul'),
('t41', 'saidova2', '0987654321', 'teacher', 'Saidova Umida Xolbekovna'),
('t42', 'saparova', '0987654321', 'teacher', 'Saparova Zarema Abdukarimovna'),
('t43', 'shamenova', '0987654321', 'teacher', 'Shamenova Saltanat Mukatirova qizi'),
('t44', 'sharikova', '0987654321', 'teacher', 'Sharikova Tatyana Vladimirovna'),
('t45', 'sherov', '0987654321', 'teacher', 'Sherov Dilmurod Kuvandikovich'),
('t46', 'tillavova', '0987654321', 'teacher', 'Tillavova Dianna Muxamedovna'),
('t47', 'tugalova', '0987654321', 'teacher', 'Tugalova Emine Ziyadinovna'),
('t48', 'tugalova2', '0987654321', 'teacher', 'Tugalova Liliya Shevketovna'),
('t49', 'turgunboyeva', '0987654321', 'teacher', 'Turg''unboyeva Durdona Shuxrat qizi'),
('t50', 'tuvalova', '0987654321', 'teacher', 'Tuvalova Gulnoza Batirovna'),
('t51', 'ubaydullayeva', '0987654321', 'teacher', 'Ubaydullayeva Sitora Xamidullo qizi'),
('t52', 'vaxidova', '0987654321', 'teacher', 'Vaxidova Svetlana Samadovna'),
('t53', 'xakimova', '0987654321', 'teacher', 'Xakimova Dilshoda Farqat qizi'),
('t54', 'xamrabayeva', '0987654321', 'teacher', 'Xamrabayeva Lola Mamajon qizi'),
('t55', 'xamroboyev', '0987654321', 'teacher', 'Xamroboyev Nozim Nasimjonovich'),
('t56', 'xaydarova', '0987654321', 'teacher', 'Xaydarova Ramilya Muxamatshamirovna'),
('t57', 'xershko', '0987654321', 'teacher', 'Xershko Emine Fikriyevna'),
('t58', 'xodjayeva', '0987654321', 'teacher', 'Xodjayeva Dildora Abdugaparovna'),
('t59', 'xudaykulova', '0987654321', 'teacher', 'Xudaykulova Umida Alibekovna'),
('t60', 'yulchiyev', '0987654321', 'teacher', 'Yulchiyev Baxtiyar Zokirjonovich'),
('t61', 'yuldasheva', '0987654321', 'teacher', 'Yuldasheva Xalkiz Kantureyevna'),
('t62', 'yusufov', '0987654321', 'teacher', 'Yusufov Shaxzod Shavkat o''g''li'),
('t63', 'zakirayeva', '0987654321', 'teacher', 'Zakirayeva Sharofat Safarovna'),
('t64', 'zuldayeva', '0987654321', 'teacher', 'Zuldayeva Elmira Usmanovna')
ON CONFLICT (login) DO NOTHING;

-- Insert Teacher records
INSERT INTO "Teacher" (id, "userId", "directorId", subject) VALUES
('teacher_1', 't1', 'director_39', 'Umumiy'),
('teacher_2', 't2', 'director_39', 'Umumiy'),
('teacher_3', 't3', 'director_39', 'Umumiy'),
('teacher_4', 't4', 'director_39', 'Umumiy'),
('teacher_5', 't5', 'director_39', 'Umumiy'),
('teacher_6', 't6', 'director_39', 'Umumiy'),
('teacher_7', 't7', 'director_39', 'Umumiy'),
('teacher_8', 't8', 'director_39', 'Umumiy'),
('teacher_9', 't9', 'director_39', 'Umumiy'),
('teacher_10', 't10', 'director_39', 'Umumiy'),
('teacher_11', 't11', 'director_39', 'Umumiy'),
('teacher_12', 't12', 'director_39', 'Umumiy'),
('teacher_13', 't13', 'director_39', 'Umumiy'),
('teacher_14', 't14', 'director_39', 'Umumiy'),
('teacher_15', 't15', 'director_39', 'Umumiy'),
('teacher_16', 't16', 'director_39', 'Umumiy'),
('teacher_17', 't17', 'director_39', 'Umumiy'),
('teacher_18', 't18', 'director_39', 'Umumiy'),
('teacher_19', 't19', 'director_39', 'Umumiy'),
('teacher_20', 't20', 'director_39', 'Umumiy'),
('teacher_21', 't21', 'director_39', 'Umumiy'),
('teacher_22', 't22', 'director_39', 'Umumiy'),
('teacher_23', 't23', 'director_39', 'Umumiy'),
('teacher_24', 't24', 'director_39', 'Umumiy'),
('teacher_25', 't25', 'director_39', 'Umumiy'),
('teacher_26', 't26', 'director_39', 'Umumiy'),
('teacher_27', 't27', 'director_39', 'Umumiy'),
('teacher_28', 't28', 'director_39', 'Umumiy'),
('teacher_29', 't29', 'director_39', 'Umumiy'),
('teacher_30', 't30', 'director_39', 'Umumiy'),
('teacher_31', 't31', 'director_39', 'Umumiy'),
('teacher_32', 't32', 'director_39', 'Umumiy'),
('teacher_33', 't33', 'director_39', 'Umumiy'),
('teacher_34', 't34', 'director_39', 'Umumiy'),
('teacher_35', 't35', 'director_39', 'Umumiy'),
('teacher_36', 't36', 'director_39', 'Umumiy'),
('teacher_37', 't37', 'director_39', 'Umumiy'),
('teacher_38', 't38', 'director_39', 'Umumiy'),
('teacher_39', 't39', 'director_39', 'Umumiy'),
('teacher_40', 't40', 'director_39', 'Umumiy'),
('teacher_41', 't41', 'director_39', 'Umumiy'),
('teacher_42', 't42', 'director_39', 'Umumiy'),
('teacher_43', 't43', 'director_39', 'Umumiy'),
('teacher_44', 't44', 'director_39', 'Umumiy'),
('teacher_45', 't45', 'director_39', 'Umumiy'),
('teacher_46', 't46', 'director_39', 'Umumiy'),
('teacher_47', 't47', 'director_39', 'Umumiy'),
('teacher_48', 't48', 'director_39', 'Umumiy'),
('teacher_49', 't49', 'director_39', 'Umumiy'),
('teacher_50', 't50', 'director_39', 'Umumiy'),
('teacher_51', 't51', 'director_39', 'Umumiy'),
('teacher_52', 't52', 'director_39', 'Umumiy'),
('teacher_53', 't53', 'director_39', 'Umumiy'),
('teacher_54', 't54', 'director_39', 'Umumiy'),
('teacher_55', 't55', 'director_39', 'Umumiy'),
('teacher_56', 't56', 'director_39', 'Umumiy'),
('teacher_57', 't57', 'director_39', 'Umumiy'),
('teacher_58', 't58', 'director_39', 'Umumiy'),
('teacher_59', 't59', 'director_39', 'Umumiy'),
('teacher_60', 't60', 'director_39', 'Umumiy'),
('teacher_61', 't61', 'director_39', 'Umumiy'),
('teacher_62', 't62', 'director_39', 'Umumiy'),
('teacher_63', 't63', 'director_39', 'Umumiy'),
('teacher_64', 't64', 'director_39', 'Umumiy')
ON CONFLICT (id) DO NOTHING;
