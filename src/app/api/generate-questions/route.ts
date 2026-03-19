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

    // Create detailed prompt
    const prompt = `${topic} mavzusida ${questionCount} ta Professional test savoli yarating.

TALABLAR:
1. Har bir savol ${topic} mavzusiga CHINAKAM tegishli bo'lishi kerak
2. Savollar turli xil bo'lsin: ta'rif, misol, hisoblash, tahlil
3. Har bir savol aniq va tushunarli bo'lsin
4. 4 ta javob varianti (faqat bittasi to'g'ri)
5. To'g'ri javoblar turli xil variantlarda tarqalgan bo'lsin
6. O'zbek tilida yozing

FAKAT JSON FORMATIDA JAVOB BERING:
[
  {
    "question": "Aniq ${topic} savoli?",
    "options": ["Javob A", "Javob B", "Javob C", "Javob D"],
    "correct": 0
  }
]

${topic} mavzusida ${questionCount} ta savol yarat!`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Siz professional ta\'lim test yaratuvchisisiz. Faqat JSON massiv qaytaring. Hech qanday tushuntirish YO\'Q!'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 8000,
    })

    const content = completion.choices[0]?.message?.content || ''

    // Parse questions
    const questions = parseAIResponse(content, topic, questionCount)
    
    // Check if real AI questions or demo fallback
    const isDemo = questions.some(q => 
      q.question.includes('nima va u qanday maqsadda') ||
      q.question.includes('asosiy afzalliklari qanday')
    )

    return NextResponse.json({ 
      questions,
      generated: questions.length,
      requested: questionCount,
      isDemo
    })

  } catch (error: any) {
    console.error('[AI Generate] Error:', error.message)
    
    // Generate better demo questions based on topic
    const demoQuestions = generateTopicQuestions(topic, questionCount)
    return NextResponse.json({ 
      questions: demoQuestions,
      generated: questionCount,
      requested: questionCount,
      isDemo: true,
      error: error.message
    })
  }
}

function parseAIResponse(content: string, topic: string, count: number) {
  let questions: any[] = []

  // Strategy 1: Direct JSON parse
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed) && parsed.length > 0) {
      questions = parsed
    }
  } catch (e) {}

  // Strategy 2: Extract from markdown code block
  if (questions.length === 0) {
    try {
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch) {
        const parsed = JSON.parse(codeBlockMatch[1].trim())
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions = parsed
        }
      }
    } catch (e) {}
  }

  // Strategy 3: Find JSON array
  if (questions.length === 0) {
    try {
      const arrayMatch = content.match(/\[[\s\S]*?\](?=\s*$|\s*```)/)
      if (arrayMatch) {
        const parsed = JSON.parse(arrayMatch[0])
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions = parsed
        }
      }
    } catch (e) {}
  }

  // Strategy 4: Find individual question objects
  if (questions.length === 0) {
    try {
      const questionPattern = /\{\s*"question"\s*:\s*"[^"]*"\s*,\s*"options"\s*:\s*\[[^\]]*\]\s*,\s*"correct"\s*:\s*\d+\s*\}/g
      const matches = content.match(questionPattern)
      if (matches && matches.length > 0) {
        questions = matches.map(m => JSON.parse(m))
      }
    } catch (e) {}
  }

  // If no questions, return topic-based demo
  if (questions.length === 0) {
    return generateTopicQuestions(topic, count)
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

  if (validQuestions.length < requestedCount) {
    const demoQuestions = generateTopicQuestions(topic, requestedCount - validQuestions.length)
    return [...validQuestions, ...demoQuestions].slice(0, requestedCount)
  }

  return validQuestions.slice(0, requestedCount)
}

// Generate topic-specific demo questions
function generateTopicQuestions(topic: string, count: number) {
  const topicLower = topic.toLowerCase()
  
  // Math/Algebra questions
  if (topicLower.includes('matematika') || topicLower.includes('algebra') || topicLower.includes('geometriya')) {
    return generateMathQuestions(topic, count)
  }
  
  // Physics questions
  if (topicLower.includes('fizika') || topicLower.includes('nyuton') || topicLower.includes('fizik')) {
    return generatePhysicsQuestions(topic, count)
  }
  
  // English questions
  if (topicLower.includes('ingliz') || topicLower.includes('english') || topicLower.includes('grammatika')) {
    return generateEnglishQuestions(topic, count)
  }
  
  // History questions
  if (topicLower.includes('tarix') || topicLower.includes('history') || topicLower.includes('o\'zbekiston')) {
    return generateHistoryQuestions(topic, count)
  }
  
  // Biology questions
  if (topicLower.includes('biologiya') || topicLower.includes('tibbiy') || topicLower.includes('organ')) {
    return generateBiologyQuestions(topic, count)
  }
  
  // Chemistry questions
  if (topicLower.includes('kimyo') || topicLower.includes('element') || topicLower.includes('molekula')) {
    return generateChemistryQuestions(topic, count)
  }
  
  // Programming questions
  if (topicLower.includes('dasturlash') || topicLower.includes('programming') || topicLower.includes('javascript') || topicLower.includes('python')) {
    return generateProgrammingQuestions(topic, count)
  }
  
  // Generic questions (last resort)
  return generateGenericQuestions(topic, count)
}

function generateMathQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic}: 2x + 5 = 13 tenglamani yeching. x ning qiymati qancha?`,
      options: ['x = 4', 'x = 8', 'x = 5', 'x = 3'],
      correct: 0
    },
    {
      question: `${topic}: Kvadrat tenglamaning diskriminanti D = b² - 4ac formulasi bilan hisoblanadi. Agar D > 0 bo'lsa, tenglamaning nechta haqiqiy ildizi bor?`,
      options: ['1 ta', '2 ta', '0 ta', 'Cheksiz ko\'p'],
      correct: 1
    },
    {
      question: `${topic}: a² - b² ifodani qanday ko'rinishda yozish mumkin?`,
      options: ['(a + b)²', '(a - b)²', '(a + b)(a - b)', '(a - b)(a + b)'],
      correct: 2
    },
    {
      question: `${topic}: 15 sonining 20% ini toping.`,
      options: ['3', '5', '7.5', '4'],
      correct: 0
    },
    {
      question: `${topic}: Pythagor teoremasiga ko'ra, to'g'ri burchakli uchburchakda gipotenuza qanday hisoblanadi?`,
      options: ['c = a + b', 'c² = a² + b²', 'c = a × b', 'c = (a + b) / 2'],
      correct: 1
    },
    {
      question: `${topic}: log₂(8) ning qiymati qancha?`,
      options: ['2', '3', '4', '8'],
      correct: 1
    },
    {
      question: `${topic}: Sin 90° ning qiymati qancha?`,
      options: ['0', '1', '-1', '0.5'],
      correct: 1
    },
    {
      question: `${topic}: Arifmetik progressiyada a₁ = 3, d = 2 bo'lsa, a₅ nechiga teng?`,
      options: ['9', '11', '13', '15'],
      correct: 1
    }
  ]
  
  return repeatQuestions(questions, count)
}

function generatePhysicsQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic}: Nyutonning birinchi qonuni (inersiya qonuni) nimani bildiradi?`,
      options: [
        'Kuch tezlanish hosil qiladi',
        'Tashqi kuch ta\'sirisiz jism holatini saqlab qoladi',
        'Har bir ta\'sirga teskari yo\'nalishdagi aks ta\'sir mavjud',
        'Energiya saqlanadi'
      ],
      correct: 1
    },
    {
      question: `${topic}: Nyutonning ikkinchi qonuniga ko'ra, F = ?`,
      options: ['F = m + a', 'F = m × a', 'F = m / a', 'F = m - a'],
      correct: 1
    },
    {
      question: `${topic}: Jismning tezligi 36 km/soat ga teng. Bu m/s da qancha?`,
      options: ['5 m/s', '10 m/s', '15 m/s', '20 m/s'],
      correct: 1
    },
    {
      question: `${topic}: Erkin tushish tezlanishi g ning qiymati Yerda qanchaga teng?`,
      options: ['9.8 m/s²', '10.8 m/s²', '8.9 m/s²', '9.0 m/s²'],
      correct: 0
    },
    {
      question: `${topic}: Kinetik energiya qanday formula bilan hisoblanadi?`,
      options: ['E = mgh', 'E = ½mv²', 'E = F × s', 'E = kx²/2'],
      correct: 1
    },
    {
      question: `${topic}: Bir kilowatt-soat (kWh) qancha joulga teng?`,
      options: ['1000 J', '3600 J', '3600000 J', '1000000 J'],
      correct: 2
    },
    {
      question: `${topic}: Ohm qonuni qanday ifodalanadi?`,
      options: ['I = R/U', 'I = U/R', 'U = I × R²', 'R = I × U'],
      correct: 1
    }
  ]
  
  return repeatQuestions(questions, count)
}

function generateEnglishQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic}: "She ___ to school every day" gapni to'ldiring.`,
      options: ['go', 'goes', 'going', 'went'],
      correct: 1
    },
    {
      question: `${topic}: Qaysi so'z ot (noun) hisoblanadi?`,
      options: ['Beautiful', 'Quickly', 'Happiness', 'Run'],
      correct: 2
    },
    {
      question: `${topic}: "I have been studying English ___ three years" gapda qaysi predlog ishlatiladi?`,
      options: ['since', 'for', 'during', 'in'],
      correct: 1
    },
    {
      question: `${topic}: Present Continuous vaqtining asosiy ma'nosi nima?`,
      options: [
        'O\'tgan zamonda sodir bo\'lgan harakat',
        'Hozir sodir bo\'layotgan harakat',
        'Kelajakda sodir bo\'ladigan harakat',
        'Doimiy harakat'
      ],
      correct: 1
    },
    {
      question: `${topic}: "He didn't ___ to the cinema yesterday" - to'g'ri fe'l shaklini tanlang.`,
      options: ['go', 'goes', 'went', 'going'],
      correct: 0
    },
    {
      question: `${topic}: "Book" so'zining ko'plik shakli qanday?`,
      options: ['Bookes', 'Books', 'Bookies', 'Booken'],
      correct: 1
    },
    {
      question: `${topic}: "She is ___ than her sister" - qiyosiy daraja uchun to'g'ri so'zni tanlang.`,
      options: ['tall', 'taller', 'tallest', 'more tall'],
      correct: 1
    }
  ]
  
  return repeatQuestions(questions, count)
}

function generateHistoryQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic}: O'zbekiston mustaqilligi qachon e'lon qilingan?`,
      options: ['1990 yil 1 sentyabr', '1991 yil 1 sentyabr', '1991 yil 31 avgust', '1992 yil 1 yanvar'],
      correct: 1
    },
    {
      question: `${topic}: Amir Temur qachon tug'ilgan?`,
      options: ['1326 yil', '1336 yil', '1346 yil', '1356 yil'],
      correct: 1
    },
    {
      question: `${topic}: Samarqand shahri qachon asos solingan?`,
      options: ['Miloddan avvalgi 700 yil', 'Miloddan avvalgi 500 yil', 'Milodiy 100 yil', 'Milodiy 300 yil'],
      correct: 0
    },
    {
      question: `${topic}: "Temuriyllar sulolasi" kim tomonidan asos solingan?`,
      options: ['Amir Temur', 'Shohruh Mirzo', 'Mirzo Ulug\'bek', 'Bobur'],
      correct: 0
    },
    {
      question: `${topic}: Ulug\'bek rasadxonasi qayerda joylashgan?`,
      options: ['Buxoroda', 'Samarqandda', 'Toshkentda', 'Xivada'],
      correct: 1
    }
  ]
  
  return repeatQuestions(questions, count)
}

function generateBiologyQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic}: Hujayraning "quvvat stantsiyasi" deb qaysi organellani aytiladi?`,
      options: ['Ribosoma', 'Mitoxondriya', 'Lizosoma', 'Golji apparati'],
      correct: 1
    },
    {
      question: `${topic}: Inson organizmida nechta suyak bor?`,
      options: ['186 ta', '206 ta', '226 ta', '246 ta'],
      correct: 1
    },
    {
      question: `${topic}: DNK ning to'liq yozilishi qanday?`,
      options: [
        'Deoksiribonuklein kislota',
        'Ribonuklein kislota',
        'Adenozintrifosfat',
        'Nuklein kislota'
      ],
      correct: 0
    },
    {
      question: `${topic}: Inson yuragi nechta bo'lmadan iborat?`,
      options: ['2 ta', '3 ta', '4 ta', '5 ta'],
      correct: 2
    },
    {
      question: `${topic}: Oqsillarning asosiy tarkibiy qismi nima?`,
      options: ['Aminokislotalar', 'Uglevodlar', 'Yog\'lar', 'Vitaminlar'],
      correct: 0
    }
  ]
  
  return repeatQuestions(questions, count)
}

function generateChemistryQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic}: Mendeleyev davriy jadvalida nechta element bor?`,
      options: ['108 ta', '112 ta', '118 ta', '120 ta'],
      correct: 2
    },
    {
      question: `${topic}: Suvning kimyoviy formulasi qanday?`,
      options: ['H₂O', 'CO₂', 'NaCl', 'H₂SO₄'],
      correct: 0
    },
    {
      question: `${topic}: Kislorodning atom raqami qancha?`,
      options: ['6', '7', '8', '9'],
      correct: 2
    },
    {
      question: `${topic}: "NaCl" nima?`,
      options: ['Shakar', 'Tuz', 'Soda', 'Kislota'],
      correct: 1
    },
    {
      question: `${topic}: pH < 7 bo'lsa, muhit qanday bo'ladi?`,
      options: ['Neytral', 'Ishqoriy', 'Kislotali', 'Amfoter'],
      correct: 2
    }
  ]
  
  return repeatQuestions(questions, count)
}

function generateProgrammingQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic}: JavaScript da o'zgaruvchi e'lon qilish uchun qaysi kalit so'z ishlatiladi?`,
      options: ['var', 'int', 'string', 'dim'],
      correct: 0
    },
    {
      question: `${topic}: "if" operatori nima uchun ishlatiladi?`,
      options: [
        'Takrorlash uchun',
        'Shartli tekshirish uchun',
        'Funksiya yaratish uchun',
        'O\'zgaruvchi e\'lon qilish uchun'
      ],
      correct: 1
    },
    {
      question: `${topic}: For tsiklining to'g'ri yozilishi qaysi?`,
      options: [
        'for(i = 0; i < 10; i++)',
        'for i in range(10)',
        'foreach(i as value)',
        'Barchasi to\'g\'ri, tilga bog\'liq'
      ],
      correct: 3
    },
    {
      question: `${topic}: Array (massiv) nima?`,
      options: [
        'O\'zgaruvchi turi',
        'Ma\'lumotlar to\'plami',
        'Funksiya',
        'Operator'
      ],
      correct: 1
    },
    {
      question: `${topic}: "Hello World" chiqarish uchun JavaScript da qaysi method ishlatiladi?`,
      options: ['print()', 'console.log()', 'echo()', 'printf()'],
      correct: 1
    }
  ]
  
  return repeatQuestions(questions, count)
}

function generateGenericQuestions(topic: string, count: number) {
  const questions = [
    {
      question: `${topic} sohasida asosiy tushunchalardan biri qaysi?`,
      options: ['Asosiy tamoyillar', 'Faqat amaliy ko\'nikmalar', 'Hech qanday tushuncha yo\'q', 'Faqat nazariya'],
      correct: 0
    },
    {
      question: `${topic} ni o'rganishda eng muhim element nima?`,
      options: ['Amaliyot va nazariya', 'Faqat kitoblar', 'Faqat video darslar', 'Hech narsa'],
      correct: 0
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
      question: `${topic} ning zamonaviy tatbiqlari qanday?`,
      options: [
        'Keng qo\'llaniladi',
        'Faqat nazariyada mavjud',
        'Qo\'llanilmaydi',
        'Faqat bir sohada'
      ],
      correct: 0
    },
    {
      question: `${topic} bo'yicha resurslar qayerdan topish mumkin?`,
      options: [
        'Kitoblar va internet',
        'Faqat kitoblar',
        'Faqat internet',
        'Hech qayerdan'
      ],
      correct: 0
    }
  ]
  
  return repeatQuestions(questions, count)
}

function repeatQuestions(questions: any[], count: number) {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push({ ...questions[i % questions.length] })
  }
  return result
}
