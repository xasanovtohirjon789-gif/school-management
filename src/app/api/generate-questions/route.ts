import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { topic, count = 5 } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Mavzu kiritilmagan' },
        { status: 400 }
      )
    }

    // Limit count to reasonable range
    const questionCount = Math.min(Math.max(count, 1), 50)

    const zai = await ZAI.create()

    const prompt = `Siz professional ta'lim test yaratuvchisisiz. "${topic}" mavzusida ${questionCount} ta test savoli yarating.

Har bir savol uchun quyidagi JSON formatida javob bering:
{
  "question": "Savol matni",
  "options": ["A javob", "B javob", "C javob", "D javob"],
  "correct": 0
}

Muhim qoidalar:
- Savollar ${topic} mavzusida bo'lsin va bir-biridan farq qilsin
- Har bir savol 4 ta javob variantiga ega bo'lsin
- correct maydoni to'g'ri javob indeksini ko'rsatsin (0-3)
- Faqat JSON massiv qaytaring, boshqa matn kerak emas
- O'zbek tilida yozing
- Savollar turli xil bo'lsin: ta'rif, misol, tahlil, solishtirish turlarida
- To'g'ri javoblar turli variantlarda bo'lsin (hammasi A yoki B bo'lmasin)

${questionCount} ta savol yarating. Faqat JSON massiv qaytaring!`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Siz professional ta'lim test yaratuvchisisiz. Faqat toza JSON formatida javob bering. Hech qanday tushuntirish yoki matn qo'shmang.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
    })

    const content = completion.choices[0]?.message?.content || ''

    // Parse JSON from response
    let questions
    try {
      // Try to extract JSON array from response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON array found')
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // If parsing fails, generate demo questions
      questions = generateDemoQuestions(topic, questionCount)
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      questions = generateDemoQuestions(topic, questionCount)
    }

    // Ensure we have the requested number of questions
    if (questions.length < questionCount) {
      const additionalQuestions = generateDemoQuestions(topic, questionCount - questions.length)
      questions = [...questions, ...additionalQuestions]
    } else if (questions.length > questionCount) {
      questions = questions.slice(0, questionCount)
    }

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
