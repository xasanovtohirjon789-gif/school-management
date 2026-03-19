import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, count = 5 } = body

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mavzu kiritilmagan' },
        { status: 400 }
      )
    }

    // Limit count to reasonable range
    const questionCount = Math.min(Math.max(Number(count) || 5, 1), 50)
    const sanitizedTopic = topic.trim().slice(0, 200)

    const zai = await ZAI.create()

    const systemPrompt = `Siz professional ta'lim sohasida test savollari yaratuvchi mutaxassissiz. Sizning vazifangiz - berilgan mavzu bo'yicha sifatli, tushunarli va ta'limiy qiymatga ega bo'lgan test savollarini yaratish.

JAVOB FORMATI:
Faqat va faqat JSON massiv qaytaring. Boshqa hech qanday matn, tushuntirish yoki izoh YO'Q!

Har bir savol quyidagi formatda bo'lishi shart:
{
  "question": "Savol matni (ochiq va tushunarli)",
  "options": ["_variant_1_", "_variant_2_", "_variant_3_", "_variant_4_"],
  "correct": 0
}

correct maydoni to'g'ri javobning indeksini bildiradi (0, 1, 2 yoki 3).`

    const userPrompt = `Mavzu: "${sanitizedTopic}"

Shu mavzu bo'yicha ${questionCount} ta test savoli yarating.

TALABLAR:
1. Har bir savol aniq va tushunarli bo'lsin
2. 4 ta javob varianti bo'lsin (faqat bittasi to'g'ri)
3. To'g'ri javoblar turli variantlarda tarqalgan bo'lsin
4. Savollar turli darajada: oson, o'rta, qiyin
5. O'zbek tilida yozing
6. Savollar mavzuga aloqador bo'lsin

Javobni faqat JSON massiv ko'rinishida bering!`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content || ''

    // Parse JSON from response with multiple fallback strategies
    let questions = parseQuestionsFromResponse(content, sanitizedTopic, questionCount)

    // Validate and clean questions
    questions = validateAndCleanQuestions(questions, sanitizedTopic, questionCount)

    return NextResponse.json({ 
      questions,
      generated: questions.length,
      requested: questionCount 
    })

  } catch (error) {
    console.error('AI generation error:', error)
    
    // Return demo questions on error
    try {
      const body = await request.json()
      const count = Math.min(Math.max(body.count || 5, 1), 50)
      return NextResponse.json({ 
        questions: generateDemoQuestions(body.topic || 'Test', count),
        generated: count,
        requested: count,
        isDemo: true 
      })
    } catch {
      return NextResponse.json({ 
        questions: generateDemoQuestions('Test', 5),
        generated: 5,
        requested: 5,
        isDemo: true 
      })
    }
  }
}

function parseQuestionsFromResponse(content: string, topic: string, count: number) {
  // Strategy 1: Try direct JSON parse
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) return parsed
  } catch {}

  // Strategy 2: Extract JSON array from text
  try {
    const jsonMatch = content.match(/\[[\s\S]*?\](?=\s*$|\s*[^,\]\s])/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}

  // Strategy 3: Find all JSON objects and create array
  try {
    const objectMatches = content.match(/\{[^{}]*"question"[^{}]*\}/g)
    if (objectMatches && objectMatches.length > 0) {
      const questions = objectMatches.map(obj => {
        try {
          return JSON.parse(obj)
        } catch {
          return null
        }
      }).filter(q => q !== null)
      if (questions.length > 0) return questions
    }
  } catch {}

  // Fallback to demo questions
  return generateDemoQuestions(topic, count)
}

function validateAndCleanQuestions(questions: any[], topic: string, count: number) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return generateDemoQuestions(topic, count)
  }

  // Clean and validate each question
  const cleanedQuestions = questions
    .filter(q => q && typeof q === 'object')
    .map(q => ({
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) 
        ? q.options.map((o: any) => String(o || '').trim()).slice(0, 4)
        : ['Variant A', 'Variant B', 'Variant C', 'Variant D'],
      correct: typeof q.correct === 'number' ? Math.min(Math.max(q.correct, 0), 3) : 0
    }))
    .filter(q => q.question.length > 0 && q.options.length >= 2)

  // If not enough valid questions, add demo questions
  if (cleanedQuestions.length < count) {
    const additionalNeeded = count - cleanedQuestions.length
    const additionalQuestions = generateDemoQuestions(topic, additionalNeeded)
    return [...cleanedQuestions, ...additionalQuestions].slice(0, count)
  }

  return cleanedQuestions.slice(0, count)
}

function generateDemoQuestions(topic: string, count: number) {
  const questionTemplates = [
    {
      template: `${topic} nima va u qanday maqsadda ishlatiladi?`,
      options: [
        'Bu zamonaviy texnologiya bo\'lib, amaliyotda keng qo\'llaniladi',
        'Bu faqat nazariy tushuncha hisoblanadi',
        'Bu eski uslubdagi usul hisoblanadi',
        'Bu faqat maxsus sohalarda qo\'llaniladi'
      ],
      correct: 0
    },
    {
      template: `${topic} ning asosiy afzalliklari qanday?`,
      options: [
        'Tezkorlik va samaradorlik',
        'Faqat narx jihatidan arzonligi',
        'Faqat sifat jihatidan yaxshiligi',
        'Hech qanday afzalligi yo\'q'
      ],
      correct: 0
    },
    {
      template: `${topic} bilan ishlash uchun qanday ko\'nikmalar kerak?`,
      options: [
        'Maxsus bilim talab qilinmaydi',
        'Faqat nazariy bilimlar yetarli',
        'Amaliy ko\'nikmalar va bilimlar kerak',
        'Faqat dasturlash bilimlari kerak'
      ],
      correct: 2
    },
    {
      template: `${topic} sohasida eng muhim omil qaysi?`,
      options: [
        'Faqat texnik jihozlar',
        'Inson resurslari va bilim',
        'Moliyaviy resurslar',
        'Vaqt omili'
      ],
      correct: 1
    },
    {
      template: `${topic} ni o\'rganish uchun qaysi usul eng samarali?`,
      options: [
        'Faqat kitoblar o\'qish',
        'Amaliy mashg\'ulotlar va nazariya',
        'Faqat video darslar ko\'rish',
        'O\'z-o\'zidan o\'rganish'
      ],
      correct: 1
    },
    {
      template: `${topic} sohasidagi eng so\'nggi tendensiyalar qanday?`,
      options: [
        'Raqamlashtirish va avtomatlashtirish',
        'An\'anaviy usullarga qaytish',
        'Kichiklashtirish',
        'Markazlashtirish'
      ],
      correct: 0
    },
    {
      template: `${topic} da xatolarga yo\'l qo\'ymaslik uchun nima qilish kerak?`,
      options: [
        'Tez-tez tekshirib borish',
        'Faqat nazariy bilimlarga suyanish',
        'Boshqalarning tajribasidan foydalanmaslik',
        'Jarayonlarni murakkablashtirish'
      ],
      correct: 0
    },
    {
      template: `${topic} sohasida karyera qilish uchun nima talab qilinadi?`,
      options: [
        'Faqat oliy ma\'lumot',
        'Doimiy o\'rganish va rivojlanish',
        'Katta tajriba',
        'Maxsus sertifikatlar'
      ],
      correct: 1
    },
    {
      template: `${topic} ning kelajagi qanday bo\'lishi kutilmoqda?`,
      options: [
        'Pasayish tendensiyasi',
        'Barqaror rivojlanish',
        'Butunlay yo\'q bo\'lib ketish',
        'O\'zgarishsiz qolish'
      ],
      correct: 1
    },
    {
      template: `${topic} ni kundalik hayotda qanday qo\'llash mumkin?`,
      options: [
        'Faqat ish joyida',
        'Turli sohalarda keng qo\'llash mumkin',
        'Faqat maxsus holatlarda',
        'Umuman qo\'llash mumkin emas'
      ],
      correct: 1
    },
    {
      template: `${topic} bo\'yicha asosiy tushunchalar qaysi?`,
      options: [
        'Faqat amaliy ko\'nikmalar',
        'Nazariy asoslar va tamoyillar',
        'Faqat texnik ma\'lumotlar',
        'Hech qanday tushuncha yo\'q'
      ],
      correct: 1
    },
    {
      template: `${topic} sohasida innovatsiyalar qanday?`,
      options: [
        'Juda kam',
        'Doimiy rivojlanishda',
        'Faqat nazariyada',
        'Mavjud emas'
      ],
      correct: 1
    },
    {
      template: `${topic} ni o\'rganish qancha vaqt oladi?`,
      options: [
        'Bir necha kun',
        'Doimiy o\'rganish jarayoni',
        'Faqat bir oy',
        'Hech qancha vaqt kerak emas'
      ],
      correct: 1
    },
    {
      template: `${topic} bo\'yicha eng yaxshi manbalar qaysi?`,
      options: [
        'Kitoblar va amaliy mashg\'ulotlar',
        'Faqat video darslar',
        'Faqat ma\'ruzalar',
        'Manbalar kerak emas'
      ],
      correct: 0
    },
    {
      template: `${topic} da muvaffaqiyat kaliti nima?`,
      options: [
        'Amaliyot va doimiy o\'rganish',
        'Faqat iste\'dod',
        'Faqat ta\'lim',
        'Omad'
      ],
      correct: 0
    },
    {
      template: `${topic} bilan bog\'liq eng katta xato nima?`,
      options: [
        'Amaliyotsiz o\'rganish',
        'Ko\'p o\'qish',
        'Savol berish',
        'Tajriba qilish'
      ],
      correct: 0
    },
    {
      template: `${topic} sohasida ekspert bo\'lish uchun nima kerak?`,
      options: [
        'Ko\'p yillik tajriba',
        'Faqat sertifikat',
        'Faqat ta\'lim',
        'Hech nima kerak emas'
      ],
      correct: 0
    },
    {
      template: `${topic} ning kamchiliklari bormi?`,
      options: [
        'Ha, ammo kamchiliklarni bartaraf etish mumkin',
        'Yo\'q, kamchiliklari yo\'q',
        'Faqat narx kamchiliklari',
        'Faqat vaqt kamchiliklari'
      ],
      correct: 0
    },
    {
      template: `${topic} ni kimlar o\'rganishi kerak?`,
      options: [
        'Hamma qiziquvchan odamlar',
        'Faqat mutaxassislar',
        'Faqat talabalar',
        'Faqat o\'qituvchilar'
      ],
      correct: 0
    },
    {
      template: `${topic} bo\'yicha test topshirishga tayyormisiz?`,
      options: [
        'Ha, tayyor!',
        'Yo\'q, hali tayyor emasman',
        'Qisman tayyorman',
        'Bilmayman'
      ],
      correct: 0
    }
  ]

  // Generate questions by rotating through templates
  const questions = []
  for (let i = 0; i < count; i++) {
    const template = questionTemplates[i % questionTemplates.length]
    questions.push({
      question: template.template,
      options: template.options,
      correct: template.correct
    })
  }

  return questions
}
