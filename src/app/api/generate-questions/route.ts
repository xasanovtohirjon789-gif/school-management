import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  let topic = 'Test'
  let questionCount = 5

  try {
    const body = await request.json()
    topic = body.topic || 'Test'
    questionCount = Math.min(Math.max(Number(body.count) || 5, 1), 50)
    
    if (!body.topic || typeof body.topic !== 'string' || body.topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mavzu kiritilmagan' },
        { status: 400 }
      )
    }

    topic = body.topic.trim()
    
    // Initialize AI
    const zai = await ZAI.create()

    // Create highly specific prompt with examples
    const systemPrompt = `Siz ${topic} bo'yicha professional test savollari yaratuvchisi ekansiz.

MUHIM QOIDALAR:
1. Har bir savol faqat "${topic}" mavzusiga oid bo'lishi SHART
2. Savollar real bilimlarni tekshiradigan bo'lishi kerak
3. Har bir savol aniq va tushunarli bo'lsin
4. 4 ta javob varianti (faqat bittasi to'g'ri)
5. correct = to'g'ri javob indeksi (0, 1, 2 yoki 3)

JAVOB FORMATI - FAQAT JSON MASSIV:
[
  {"question": "Savol matni?", "options": ["A", "B", "C", "D"], "correct": 0}
]

HECH QANDAY QO'SHIMCHA MATN YO'Q! FAQAT JSON!`

    const userPrompt = `${topic} mavzusida ${questionCount} ta professional test savoli yarat.

NAMUNA (bu faqat misol, ${topic} uchun boshqa savollar yarating):
- Agar mavzu "Matematika" bo'lsa: tenglamalar, formulalar, hisoblashlar haqida savollar
- Agar mavzu "Fizika" bo'lsa: qonunlar, formulalar, hodisalar haqida savollar
- Agar mavzu "Ingliz tili" bo'lsa: grammatika, so'zlar, gaplar haqida savollar

${topic} mavzusida ${questionCount} ta aniq, professional savol yarat!`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 8000,
    })

    const content = completion.choices[0]?.message?.content || ''
    console.log('[AI Response]', content.substring(0, 500))

    // Parse questions
    const questions = parseAIResponse(content, topic, questionCount)
    
    // Check if questions are generic (fallback)
    const isGeneric = questions.some(q => 
      q.question.includes('nima va u qanday maqsadda') ||
      q.question.includes('asosiy afzalliklari qanday') ||
      q.question.includes('bilan ishlash uchun qanday ko\'nikmalar') ||
      q.question.includes('sohasida eng muhim omil') ||
      q.question.includes('o\'rganish uchun qaysi usul eng samarali')
    )

    if (isGeneric) {
      console.log('[AI] Generic questions detected, using topic-specific fallback')
      const topicQuestions = generateTopicQuestions(topic, questionCount)
      return NextResponse.json({ 
        questions: topicQuestions,
        generated: questionCount,
        requested: questionCount,
        source: 'topic-specific-fallback'
      })
    }

    return NextResponse.json({ 
      questions,
      generated: questions.length,
      requested: questionCount,
      source: 'ai'
    })

  } catch (error: any) {
    console.error('[AI Generate] Error:', error.message)
    
    // Generate topic-specific demo questions
    const demoQuestions = generateTopicQuestions(topic, questionCount)
    return NextResponse.json({ 
      questions: demoQuestions,
      generated: questionCount,
      requested: questionCount,
      source: 'error-fallback',
      error: error.message
    })
  }
}

function parseAIResponse(content: string, topic: string, count: number) {
  let questions: any[] = []

  // Clean the content
  let cleanContent = content.trim()
  
  // Remove markdown code blocks if present
  cleanContent = cleanContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
  cleanContent = cleanContent.trim()

  // Strategy 1: Direct JSON parse
  try {
    const parsed = JSON.parse(cleanContent)
    if (Array.isArray(parsed) && parsed.length > 0) {
      questions = parsed
    }
  } catch (e) {}

  // Strategy 2: Find JSON array
  if (questions.length === 0) {
    try {
      const arrayMatch = cleanContent.match(/\[[\s\S]*\]/)
      if (arrayMatch) {
        const parsed = JSON.parse(arrayMatch[0])
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions = parsed
        }
      }
    } catch (e) {}
  }

  // Strategy 3: Find individual question objects
  if (questions.length === 0) {
    try {
      const objectMatches = cleanContent.match(/\{[^{}]*"question"[^{}]*\}/g)
      if (objectMatches && objectMatches.length > 0) {
        questions = objectMatches.map(m => {
          try {
            return JSON.parse(m)
          } catch {
            return null
          }
        }).filter(q => q !== null)
      }
    } catch (e) {}
  }

  // If no questions found, return empty (will trigger fallback)
  if (questions.length === 0) {
    return []
  }

  return validateQuestions(questions, topic, count)
}

function validateQuestions(questions: any[], topic: string, requestedCount: number) {
  const validQuestions = questions
    .filter(q => q && typeof q === 'object')
    .map(q => {
      const question = String(q.question || q.text || '').trim()
      
      let options: string[]
      if (Array.isArray(q.options)) {
        options = q.options.map((o: any) => String(o || '').trim())
      } else {
        options = []
      }
      
      options = options.slice(0, 4)
      while (options.length < 4) {
        options.push(`Variant ${String.fromCharCode(65 + options.length)}`)
      }
      
      let correct = 0
      if (typeof q.correct === 'number') {
        correct = Math.min(Math.max(q.correct, 0), 3)
      }
      
      return { question, options, correct }
    })
    .filter(q => q.question.length > 10)

  return validQuestions.slice(0, requestedCount)
}

// Generate topic-specific questions
function generateTopicQuestions(topic: string, count: number) {
  const topicLower = topic.toLowerCase()
  
  // Math/Algebra questions
  if (topicLower.includes('matematika') || topicLower.includes('algebra') || topicLower.includes('geometriya') || topicLower.includes('hisob')) {
    return generateMathQuestions(topic, count)
  }
  
  // Physics questions
  if (topicLower.includes('fizika') || topicLower.includes('nyuton') || topicLower.includes('fizik') || topicLower.includes('mexanika')) {
    return generatePhysicsQuestions(topic, count)
  }
  
  // English questions
  if (topicLower.includes('ingliz') || topicLower.includes('english') || topicLower.includes('grammatika') || topicLower.includes('til')) {
    return generateEnglishQuestions(topic, count)
  }
  
  // History questions
  if (topicLower.includes('tarix') || topicLower.includes('history') || topicLower.includes('o\'zbekiston') || topicLower.includes('temur')) {
    return generateHistoryQuestions(topic, count)
  }
  
  // Biology questions
  if (topicLower.includes('biologiya') || topicLower.includes('tibbiy') || topicLower.includes('organ') || topicLower.includes('hujayra')) {
    return generateBiologyQuestions(topic, count)
  }
  
  // Chemistry questions
  if (topicLower.includes('kimyo') || topicLower.includes('element') || topicLower.includes('molekula') || topicLower.includes('reaksiya')) {
    return generateChemistryQuestions(topic, count)
  }
  
  // Programming questions
  if (topicLower.includes('dasturlash') || topicLower.includes('programming') || topicLower.includes('javascript') || topicLower.includes('python') || topicLower.includes('kod')) {
    return generateProgrammingQuestions(topic, count)
  }
  
  // Geography questions
  if (topicLower.includes('geografiya') || topicLower.includes('yer') || topicLower.includes('mamlakat') || topicLower.includes('shahar')) {
    return generateGeographyQuestions(topic, count)
  }
  
  // Literature questions
  if (topicLower.includes('adabiyot') || topicLower.includes('she\'r') || topicLower.includes('nasr') || topicLower.includes('kitob')) {
    return generateLiteratureQuestions(topic, count)
  }
  
  // Generic questions (last resort) - but more specific
  return generateSpecificQuestions(topic, count)
}

function generateMathQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `Tenglamani yeching: 2x + 5 = 13. x ning qiymati qancha?`,
      options: ['x = 4', 'x = 8', 'x = 5', 'x = 3'],
      correct: 0
    },
    {
      question: `Kvadrat tenglamaning diskriminanti D = b² - 4ac formulasi bilan hisoblanadi. Agar D > 0 bo'lsa, tenglamaning nechta haqiqiy ildizi bor?`,
      options: ['1 ta', '2 ta', '0 ta', 'Cheksiz ko\'p'],
      correct: 1
    },
    {
      question: `a² - b² ifodani qanday ko'rinishda yozish mumkin?`,
      options: ['(a + b)²', '(a - b)²', '(a + b)(a - b)', '(a - b)(a + b)'],
      correct: 2
    },
    {
      question: `15 sonining 20% ini toping.`,
      options: ['3', '5', '7.5', '4'],
      correct: 0
    },
    {
      question: `Pythagor teoremasiga ko'ra, to'g'ri burchakli uchburchakda gipotenuza qanday hisoblanadi?`,
      options: ['c = a + b', 'c² = a² + b²', 'c = a × b', 'c = (a + b) / 2'],
      correct: 1
    },
    {
      question: `log₂(8) ning qiymati qancha?`,
      options: ['2', '3', '4', '8'],
      correct: 1
    },
    {
      question: `Sin 90° ning qiymati qancha?`,
      options: ['0', '1', '-1', '0.5'],
      correct: 1
    },
    {
      question: `Arifmetik progressiyada a₁ = 3, d = 2 bo'lsa, a₅ nechiga teng?`,
      options: ['9', '11', '13', '15'],
      correct: 1
    },
    {
      question: `Geometrik progressiyada b₁ = 2, q = 3 bo'lsa, b₄ nechiga teng?`,
      options: ['18', '36', '54', '108'],
      correct: 2
    },
    {
      question: `75 sonining 4/5 qismi qanchaga teng?`,
      options: ['15', '45', '60', '80'],
      correct: 2
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generatePhysicsQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `Nyutonning birinchi qonuni (inersiya qonuni) nimani bildiradi?`,
      options: [
        'Kuch tezlanish hosil qiladi',
        'Tashqi kuch ta\'sirisiz jism holatini saqlab qoladi',
        'Har bir ta\'sirga teskari yo\'nalishdagi aks ta\'sir mavjud',
        'Energiya saqlanadi'
      ],
      correct: 1
    },
    {
      question: `Nyutonning ikkinchi qonuniga ko'ra, F = ?`,
      options: ['F = m + a', 'F = m × a', 'F = m / a', 'F = m - a'],
      correct: 1
    },
    {
      question: `Jismning tezligi 36 km/soat ga teng. Bu m/s da qancha?`,
      options: ['5 m/s', '10 m/s', '15 m/s', '20 m/s'],
      correct: 1
    },
    {
      question: `Erkin tushish tezlanishi g ning qiymati Yerda qanchaga teng?`,
      options: ['9.8 m/s²', '10.8 m/s²', '8.9 m/s²', '9.0 m/s²'],
      correct: 0
    },
    {
      question: `Kinetik energiya qanday formula bilan hisoblanadi?`,
      options: ['E = mgh', 'E = ½mv²', 'E = F × s', 'E = kx²/2'],
      correct: 1
    },
    {
      question: `Bir kilowatt-soat (kWh) qancha joulga teng?`,
      options: ['1000 J', '3600 J', '3600000 J', '1000000 J'],
      correct: 2
    },
    {
      question: `Ohm qonuni qanday ifodalanadi?`,
      options: ['I = R/U', 'I = U/R', 'U = I × R²', 'R = I × U'],
      correct: 1
    },
    {
      question: `Yorug'lik tezligi vakuumda qancha?`,
      options: ['3×10⁶ m/s', '3×10⁷ m/s', '3×10⁸ m/s', '3×10⁹ m/s'],
      correct: 2
    },
    {
      question: `Birinchi kosmik tezlik qanchaga yaqin?`,
      options: ['7.9 km/s', '11.2 km/s', '16.7 km/s', '5.0 km/s'],
      correct: 0
    },
    {
      question: `Suvning solishtirma issiqlik sig'im qancha?`,
      options: ['2100 J/(kg·K)', '4200 J/(kg·K)', '8400 J/(kg·K)', '1000 J/(kg·K)'],
      correct: 1
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateEnglishQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `"She ___ to school every day" gapni to'ldiring.`,
      options: ['go', 'goes', 'going', 'went'],
      correct: 1
    },
    {
      question: `Qaysi so'z ot (noun) hisoblanadi?`,
      options: ['Beautiful', 'Quickly', 'Happiness', 'Run'],
      correct: 2
    },
    {
      question: `"I have been studying English ___ three years" gapda qaysi predlog ishlatiladi?`,
      options: ['since', 'for', 'during', 'in'],
      correct: 1
    },
    {
      question: `Present Continuous vaqtining asosiy ma'nosi nima?`,
      options: [
        'O\'tgan zamonda sodir bo\'lgan harakat',
        'Hozir sodir bo\'layotgan harakat',
        'Kelajakda sodir bo\'ladigan harakat',
        'Doimiy harakat'
      ],
      correct: 1
    },
    {
      question: `"He didn't ___ to the cinema yesterday" - to'g'ri fe'l shaklini tanlang.`,
      options: ['go', 'goes', 'went', 'going'],
      correct: 0
    },
    {
      question: `"Book" so'zining ko'plik shakli qanday?`,
      options: ['Bookes', 'Books', 'Bookies', 'Booken'],
      correct: 1
    },
    {
      question: `"She is ___ than her sister" - qiyosiy daraja uchun to'g'ri so'zni tanlang.`,
      options: ['tall', 'taller', 'tallest', 'more tall'],
      correct: 1
    },
    {
      question: `"I ___ my homework yesterday" - o'tgan zamon uchun to'g'ri fe'l:`,
      options: ['do', 'does', 'did', 'done'],
      correct: 2
    },
    {
      question: `Qaysi gap to'g'ri tuzilgan?`,
      options: [
        'She don\'t like coffee',
        'She doesn\'t likes coffee',
        'She doesn\'t like coffee',
        'She not like coffee'
      ],
      correct: 2
    },
    {
      question: `"It is raining now" - bu qaysi zamonda?`,
      options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple'],
      correct: 1
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateHistoryQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `O'zbekiston mustaqilligi qachon e'lon qilingan?`,
      options: ['1990 yil 1 sentyabr', '1991 yil 1 sentyabr', '1991 yil 31 avgust', '1992 yil 1 yanvar'],
      correct: 1
    },
    {
      question: `Amir Temur qachon tug'ilgan?`,
      options: ['1326 yil', '1336 yil', '1346 yil', '1356 yil'],
      correct: 1
    },
    {
      question: `Samarqand shahri qachon asos solingan?`,
      options: ['Miloddan avvalgi 700 yil', 'Miloddan avvalgi 500 yil', 'Milodiy 100 yil', 'Milodiy 300 yil'],
      correct: 0
    },
    {
      question: `"Temuriyllar sulolasi" kim tomonidan asos solingan?`,
      options: ['Amir Temur', 'Shohruh Mirzo', 'Mirzo Ulug\'bek', 'Bobur'],
      correct: 0
    },
    {
      question: `Ulug'bek rasadxonasi qayerda joylashgan?`,
      options: ['Buxoroda', 'Samarqandda', 'Toshkentda', 'Xivada'],
      correct: 1
    },
    {
      question: `Bobur podsholigi qayerda joylashgan edi?`,
      options: ['Samarqandda', 'Buxoroda', "Farg'ona vodiysida", 'Xorazmda'],
      correct: 2
    },
    {
      question: `O'zbekiston Respublikasining birinchi Prezidenti kim?`,
      options: ['Shavkat Mirziyoyev', 'Islam Karimov', 'Mirziyoyev Shavkat', 'Karimov Islam'],
      correct: 1
    },
    {
      question: `Buyuk Ipak Yo'li qachon mavjud bo'lgan?`,
      options: ['Miloddan avvalgi II asr - XV asr', 'Miloddan avvalgi I asr - X asr', 'V asr - XV asr', 'X asr - XX asr'],
      correct: 0
    },
    {
      question: `Registon maydoni qaysi shaharda joylashgan?`,
      options: ['Buxoro', 'Xiva', 'Samarqand', 'Toshkent'],
      correct: 2
    },
    {
      question: `Alisher Navoiy qachon tug'ilgan?`,
      options: ['1441 yil', '1451 yil', '1461 yil', '1471 yil'],
      correct: 0
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateBiologyQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `Hujayraning "quvvat stantsiyasi" deb qaysi organellani aytiladi?`,
      options: ['Ribosoma', 'Mitoxondriya', 'Lizosoma', 'Golji apparati'],
      correct: 1
    },
    {
      question: `Inson organizmida nechta suyak bor?`,
      options: ['186 ta', '206 ta', '226 ta', '246 ta'],
      correct: 1
    },
    {
      question: `DNK ning to'liq yozilishi qanday?`,
      options: [
        'Deoksiribonuklein kislota',
        'Ribonuklein kislota',
        'Adenozintrifosfat',
        'Nuklein kislota'
      ],
      correct: 0
    },
    {
      question: `Inson yuragi nechta bo'lmadan iborat?`,
      options: ['2 ta', '3 ta', '4 ta', '5 ta'],
      correct: 2
    },
    {
      question: `Oqsillarning asosiy tarkibiy qismi nima?`,
      options: ['Aminokislotalar', 'Uglevodlar', 'Yog\'lar', 'Vitaminlar'],
      correct: 0
    },
    {
      question: `Inson organizmida nechta xromosoma bor?`,
      options: ['23 ta', '46 ta', '44 ta', '48 ta'],
      correct: 1
    },
    {
      question: `Qaysi organ "ichki sekretsiya bezi" hisoblanadi?`,
      options: ['Jigar', 'Oshqozon', 'Qalqonsimon bez', 'O\'t pufagi'],
      correct: 2
    },
    {
      question: `Nafas olish jarayonida asosiy gaz almashinuvi qaysi organlarda sodir bo'ladi?`,
      options: ['Burun bo\'shlig\'ida', 'Halqumda', 'O\'pka pufakchalarida', 'Trubada'],
      correct: 2
    },
    {
      question: `Qon qaysi hujayralar orqali kislorod tashiydi?`,
      options: ['Leykotsitlar', 'Trombotsitlar', 'Eritrotsitlar', 'Plazma'],
      correct: 2
    },
    {
      question: `Fotosintez jarayoni qaysi organellada sodir bo'ladi?`,
      options: ['Mitoxondriya', 'Xloroplast', 'Ribosoma', 'Yadro'],
      correct: 1
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateChemistryQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `Mendeleyev davriy jadvalida nechta element bor?`,
      options: ['108 ta', '112 ta', '118 ta', '120 ta'],
      correct: 2
    },
    {
      question: `Suvning kimyoviy formulasi qanday?`,
      options: ['H₂O', 'CO₂', 'NaCl', 'H₂SO₄'],
      correct: 0
    },
    {
      question: `Kislorodning atom raqami qancha?`,
      options: ['6', '7', '8', '9'],
      correct: 2
    },
    {
      question: `"NaCl" nima?`,
      options: ['Shakar', 'Osh tuzi', 'Soda', 'Kislota'],
      correct: 1
    },
    {
      question: `pH < 7 bo'lsa, muhit qanday bo'ladi?`,
      options: ['Neytral', 'Ishqoriy', 'Kislotali', 'Amfoter'],
      correct: 2
    },
    {
      question: `Vodorodning atom massasi qancha?`,
      options: ['1', '2', '3', '4'],
      correct: 0
    },
    {
      question: `Uglerod qaysi guruh elementiga kiradi?`,
      options: ['Ishqoriy metallar', 'Galogenlar', 'Nemetallar', 'Nobil gazlar'],
      correct: 2
    },
    {
      question: `Oksidlanish-darajalanish reaksiyalarida elektronlar qanday harakat qiladi?`,
      options: [
        'Oksidlanuvchi elektron qabul qiladi',
        'Darajalanuvchi elektron beradi',
        'Oksidlanuvchi elektron beradi',
        'Elektronlar almashinmaydi'
      ],
      correct: 2
    },
    {
      question: `Sulfat kislota (H₂SO₄) qanday xususiyatga ega?`,
      options: ['Ishqoriy', 'Kislotali', 'Neytral', 'Amfoter'],
      correct: 1
    },
    {
      question: `Kalsiy karbonat (CaCO₃) qizdirilganda nima hosil bo'ladi?`,
      options: ['CaO + CO₂', 'CaO + H₂O', 'Ca(OH)₂ + CO₂', 'Ca + CO₃'],
      correct: 0
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateProgrammingQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `JavaScript da o'zgaruvchi e'lon qilish uchun qaysi kalit so'zlar ishlatiladi?`,
      options: ['var, let, const', 'int, float, string', 'dim, var, let', 'def, var, val'],
      correct: 0
    },
    {
      question: `"if" operatori nima uchun ishlatiladi?`,
      options: [
        'Takrorlash uchun',
        'Shartli tekshirish uchun',
        'Funksiya yaratish uchun',
        'O\'zgaruvchi e\'lon qilish uchun'
      ],
      correct: 1
    },
    {
      question: `For tsiklining to'g'ri yozilishi qaysi?`,
      options: [
        'for(i = 0; i < 10; i++)',
        'for i in range(10)',
        'foreach(i as value)',
        'Barchasi to\'g\'ri, tilga bog\'liq'
      ],
      correct: 3
    },
    {
      question: `Array (massiv) nima?`,
      options: [
        'O\'zgaruvchi turi',
        'Ma\'lumotlar to\'plami',
        'Funksiya turi',
        'Operator'
      ],
      correct: 1
    },
    {
      question: `"Hello World" chiqarish uchun JavaScript da qaysi method ishlatiladi?`,
      options: ['print()', 'console.log()', 'echo()', 'printf()'],
      correct: 1
    },
    {
      question: `HTML da sarlavha uchun qaysi tag ishlatiladi?`,
      options: ['<p>', '<h1>', '<div>', '<span>'],
      correct: 1
    },
    {
      question: `CSS da rang berish uchun qaysi xususiyat ishlatiladi?`,
      options: ['font-size', 'color', 'margin', 'padding'],
      correct: 1
    },
    {
      question: `Python da ro'yxat (list) yaratish qanday amalga oshiriladi?`,
      options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
      correct: 1
    },
    {
      question: `Funksiya nima?`,
      options: [
        'O\'zgaruvchi',
        'Qayta ishlatiladigan kod bloki',
        'Operator',
        'Ma\'lumotlar turi'
      ],
      correct: 1
    },
    {
      question: `Git da o'zgarishlarni saqlash uchun qaysi buyruq ishlatiladi?`,
      options: ['git add', 'git commit', 'git push', 'git pull'],
      correct: 1
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateGeographyQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `O'zbekistonning maydoni qancha?`,
      options: ['388 ming km²', '448 ming km²', '288 ming km²', '548 ming km²'],
      correct: 1
    },
    {
      question: `O'zbekiston qancha davlat bilan chegaradosh?`,
      options: ['4 ta', '5 ta', '6 ta', '7 ta'],
      correct: 1
    },
    {
      question: `O'zbekistonning poytaxti qaysi?`,
      options: ['Samarqand', 'Buxoro', 'Toshkent', 'Farg\'ona'],
      correct: 2
    },
    {
      question: `Dunyodagi eng katta okean qaysi?`,
      options: ['Atlantika', 'Hind', 'Tinch', 'Shimoliy Muz'],
      correct: 2
    },
    {
      question: `O'zbekistondagi eng katta daryo qaysi?`,
      options: ['Sirdaryo', 'Amudaryo', 'Zarafshon', 'Chirchiq'],
      correct: 1
    },
    {
      question: `Qizilqum cho'li qaysi hududda joylashgan?`,
      options: ['Farg\'ona vodiysida', 'O\'zbekiston markazida', 'Qoraqalpog\'istonda', 'Toshkent viloyatida'],
      correct: 1
    },
    {
      question: `O'zbekistonda nechta viloyat bor?`,
      options: ['10 ta', '12 ta', '14 ta', '13 ta'],
      correct: 1
    },
    {
      question: `Eng baland cho'qqi - Himoloy tog'laridagi Jomolungma qancha baland?`,
      options: ['8488 m', '8848 m', '8884 m', '8448 m'],
      correct: 1
    },
    {
      question: `Orol dengizi qaysi respublikada joylashgan?`,
      options: ['Toshkent viloyatida', 'Qoraqalpog\'iston Respublikasida', 'Buxoro viloyatida', 'Xorazm viloyatida'],
      correct: 1
    },
    {
      question: `Yer yuzida nechta qit'a bor?`,
      options: ['5 ta', '6 ta', '7 ta', '8 ta'],
      correct: 1
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateLiteratureQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `Alisher Navoiy qaysi asarning muallifi?`,
      options: ['"Boburnoma"', '"Xamsa"', '"Shohnoma"', '"Devoni"'],
      correct: 1
    },
    {
      question: `"Boburnoma" asarini kim yozgan?`,
      options: ['Alisher Navoiy', 'Zahiriddin Bobur', 'Ulug\'bek', 'Fuzuliy'],
      correct: 1
    },
    {
      question: `O'zbek adabiyotining asoschisi kim hisoblanadi?`,
      options: ['Bobur', 'Navoiy', 'Ulug\'bek', 'Mashrab'],
      correct: 1
    },
    {
      question: `"Chaqmoq" she'rini kim yozgan?`,
      options: ['Hamza Hakimzoda Niyoziy', 'Abdulla Qodiriy', 'Cho\'lpon', 'Fitrat'],
      correct: 0
    },
    {
      question: `"O'tgan kunlar" romani kimning qalamiga mansub?`,
      options: ['Abdulla Qodiriy', 'Cho\'lpon', 'Fitrat', 'Abdulla Qahhor'],
      correct: 0
    },
    {
      question: `Alisher Navoiy necha yil yashagan?`,
      options: ['50 yil', '60 yil', '63 yil', '70 yil'],
      correct: 2
    },
    {
      question: `"Mehrobdan chayon" qissasini kim yozgan?`,
      options: ['Abdulla Qodiriy', 'Cho\'lpon', 'Fitrat', 'Sadriddin Ayniy'],
      correct: 1
    },
    {
      question: `She'riy asarlar to'plami nima deb ataladi?`,
      options: ['Romam', 'Doston', 'Devon', 'Qissa'],
      correct: 2
    },
    {
      question: `"Layli va Majnun" dostonini kim yozgan?`,
      options: ['Fuzuliy', 'Navoiy', 'Bobur', 'Jomiy'],
      correct: 1
    },
    {
      question: `Abdulla Qahhor qaysi janrda ijod qilgan?`,
      options: ['Doston', 'Hikoya va drama', 'She\'r', 'Epos'],
      correct: 1
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function generateSpecificQuestions(topic: string, count: number) {
  // More specific generic questions
  const questions = [
    {
      question: `${topic} sohasida asosiy tushunchalardan biri nima?`,
      options: ['Nazariy asoslar', 'Amaliy ko\'nikmalar', 'Fundamental tamoyillar', 'Barchasi'],
      correct: 3
    },
    {
      question: `${topic} sohasida professional bo'lish uchun nima kerak?`,
      options: [
        'Doimiy o\'rganish va amaliyot',
        'Faqat sertifikat',
        'Faqat oliy ma\'lumot',
        'Hech nima'
      ],
      correct: 0
    },
    {
      question: `${topic} bo'yicha bilimlarni qayerdan olish mumkin?`,
      options: [
        'Kitoblar va onlayn kurslar',
        'Faqat universitet',
        'Faqat amaliyot',
        'Hech qayerdan'
      ],
      correct: 0
    },
    {
      question: `${topic} sohasida yangiliklarni qanday kuzatish mumkin?`,
      options: [
        'Ilmiy jurnallar va konferensiyalar',
        'Faqat TV',
        'Faqat do\'stlardan',
        'Kuzatib bo\'lmaydi'
      ],
      correct: 0
    },
    {
      question: `${topic} sohasida karyera qilish uchun nima muhim?`,
      options: [
        'Bilim va tajriba',
        'Faqat aloqalar',
        'Faqat pul',
        'Hech nima'
      ],
      correct: 0
    }
  ]
  
  return shuffleAndTake(questions, count)
}

function shuffleAndTake(questions: any[], count: number) {
  // Shuffle the questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  // Take the requested number
  return shuffled.slice(0, count).map((q, i) => ({ ...q, id: `q_${i}` }))
}
