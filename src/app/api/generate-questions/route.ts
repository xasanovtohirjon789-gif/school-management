import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const maxDuration = 60 // 60 seconds timeout

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
    
    console.log(`[AI Generate] Topic: "${topic}", Count: ${questionCount}`)

    // Initialize AI
    const zai = await ZAI.create()
    console.log('[AI Generate] ZAI initialized')

    // Create prompt
    const prompt = `${topic} mavzusida ${questionCount} ta sifatli test savoli yarating.

MUHIM QOIDALAR:
1. Har bir savol aniq ${topic} mavzusiga tegishli bo'lishi kerak
2. Savollar bir-biridan farq qilishi kerak
3. Har bir savol 4 ta javob variantiga ega bo'lsin
4. Faqat bitta javob to'g'ri bo'lsin
5. To'g'ri javoblar turli variantlarda bo'lsin (hammasi A emas)
6. O'zbek tilida yozing

JAVOB FORMATI - faqat JSON massiv:
[
  {
    "question": "Savol matni",
    "options": ["A variant", "B variant", "C variant", "D variant"],
    "correct": 0
  }
]

Hoziroq ${topic} mavzusida ${questionCount} ta savol yarating. Faqat JSON qaytaring!`

    // Call AI
    console.log('[AI Generate] Sending request to AI...')
    const startTime = Date.now()
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Siz professional test savollari yaratuvchisisiz. Faqat JSON formatida javob bering. Hech qanday tushuntirish yozmang.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 8000,
    })

    const elapsed = Date.now() - startTime
    console.log(`[AI Generate] AI responded in ${elapsed}ms`)

    const content = completion.choices[0]?.message?.content || ''
    console.log('[AI Generate] Response length:', content.length)
    console.log('[AI Generate] Response preview:', content.substring(0, 200))

    // Parse questions
    const questions = parseAIResponse(content, topic, questionCount)
    
    // Check if we got real AI questions or demo fallback
    const isDemo = questions.length > 0 && questions[0].question.includes(topic + ' nima')
    
    if (isDemo) {
      console.log('[AI Generate] WARNING: Using demo questions!')
    } else {
      console.log('[AI Generate] Successfully parsed', questions.length, 'AI questions')
    }

    return NextResponse.json({ 
      questions,
      generated: questions.length,
      requested: questionCount,
      isDemo
    })

  } catch (error: any) {
    console.error('[AI Generate] Error:', error.message)
    console.error('[AI Generate] Stack:', error.stack)
    
    // Return demo questions on error
    const demoQuestions = generateDemoQuestions(topic, questionCount)
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
      console.log('[Parse] Strategy 1 success:', questions.length, 'questions')
    }
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 2: Extract JSON array from markdown code block
  if (questions.length === 0) {
    try {
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch) {
        const parsed = JSON.parse(codeBlockMatch[1].trim())
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions = parsed
          console.log('[Parse] Strategy 2 success:', questions.length, 'questions')
        }
      }
    } catch (e) {
      // Continue
    }
  }

  // Strategy 3: Find JSON array pattern
  if (questions.length === 0) {
    try {
      // Match the largest JSON array
      const arrayMatch = content.match(/\[[\s\S]*?\](?=\s*$|\s*```)/)
      if (arrayMatch) {
        const parsed = JSON.parse(arrayMatch[0])
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions = parsed
          console.log('[Parse] Strategy 3 success:', questions.length, 'questions')
        }
      }
    } catch (e) {
      // Continue
    }
  }

  // Strategy 4: Build array from individual question objects
  if (questions.length === 0) {
    try {
      // Find all question objects
      const questionPattern = /\{\s*"question"\s*:\s*"[^"]*"\s*,\s*"options"\s*:\s*\[[^\]]*\]\s*,\s*"correct"\s*:\s*\d+\s*\}/g
      const matches = content.match(questionPattern)
      if (matches && matches.length > 0) {
        questions = matches.map(m => JSON.parse(m))
        console.log('[Parse] Strategy 4 success:', questions.length, 'questions')
      }
    } catch (e) {
      // Continue
    }
  }

  // If still no questions, use demo
  if (questions.length === 0) {
    console.log('[Parse] All strategies failed, using demo questions')
    return generateDemoQuestions(topic, count)
  }

  // Validate and clean questions
  const cleaned = validateQuestions(questions, topic, count)
  return cleaned
}

function validateQuestions(questions: any[], topic: string, requestedCount: number) {
  const validQuestions = questions
    .filter(q => q && typeof q === 'object')
    .map(q => {
      // Ensure question has text
      const question = String(q.question || q.text || q.savol || '').trim()
      
      // Ensure options array
      let options: string[]
      if (Array.isArray(q.options)) {
        options = q.options.map((o: any) => String(o || '').trim())
      } else if (Array.isArray(q.variants)) {
        options = q.variants.map((o: any) => String(o || '').trim())
      } else {
        options = []
      }
      
      // Ensure at least 2 options, max 4
      options = options.slice(0, 4)
      while (options.length < 4) {
        options.push(`Variant ${String.fromCharCode(65 + options.length)}`)
      }
      
      // Ensure correct answer index
      let correct = 0
      if (typeof q.correct === 'number') {
        correct = Math.min(Math.max(q.correct, 0), 3)
      } else if (typeof q.answer === 'number') {
        correct = Math.min(Math.max(q.answer, 0), 3)
      }
      
      return { question, options, correct }
    })
    .filter(q => q.question.length > 10) // Filter out empty/short questions

  // If not enough questions, supplement with demo
  if (validQuestions.length < requestedCount) {
    const demoQuestions = generateDemoQuestions(topic, requestedCount - validQuestions.length)
    return [...validQuestions, ...demoQuestions].slice(0, requestedCount)
  }

  return validQuestions.slice(0, requestedCount)
}

function generateDemoQuestions(topic: string, count: number) {
  const templates = [
    {
      question: `${topic} nima va u qanday maqsadda ishlatiladi?`,
      options: [
        'Bu zamonaviy texnologiya bo\'lib, amaliyotda keng qo\'llaniladi',
        'Bu faqat nazariy tushuncha hisoblanadi',
        'Bu eski uslubdagi usul hisoblanadi',
        'Bu faqat maxsus sohalarda qo\'llaniladi'
      ],
      correct: 0
    },
    {
      question: `${topic} ning asosiy afzalliklari qanday?`,
      options: [
        'Tezkorlik va samaradorlik',
        'Faqat narx jihatidan arzonligi',
        'Faqat sifat jihatidan yaxshiligi',
        'Hech qanday afzalligi yo\'q'
      ],
      correct: 0
    },
    {
      question: `${topic} bilan ishlash uchun qanday ko\'nikmalar kerak?`,
      options: [
        'Maxsus bilim talab qilinmaydi',
        'Faqat nazariy bilimlar yetarli',
        'Amaliy ko\'nikmalar va bilimlar kerak',
        'Faqat dasturlash bilimlari kerak'
      ],
      correct: 2
    },
    {
      question: `${topic} sohasida eng muhim omil qaysi?`,
      options: [
        'Faqat texnik jihozlar',
        'Inson resurslari va bilim',
        'Moliyaviy resurslar',
        'Vaqt omili'
      ],
      correct: 1
    },
    {
      question: `${topic} ni o\'rganish uchun qaysi usul eng samarali?`,
      options: [
        'Faqat kitoblar o\'qish',
        'Amaliy mashg\'ulotlar va nazariya',
        'Faqat video darslar ko\'rish',
        'O\'z-o\'zidan o\'rganish'
      ],
      correct: 1
    }
  ]

  const result = []
  for (let i = 0; i < count; i++) {
    const t = templates[i % templates.length]
    result.push({ ...t })
  }
  return result
}
