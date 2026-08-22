import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with a fallback for build time
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
      return NextResponse.json(
        { error: 'OpenAI API Key is missing. Please add it to .env.local' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    const systemPrompt = `คุณคือ AI ผู้เชี่ยวชาญด้านโหราศาสตร์ไทย และยามอุบากอง ชื่อ NEXORA
คุณทำหน้าที่ให้คำแนะนำเกี่ยวกับฤกษ์ยาม การเดินทาง การทำงาน และการเจรจาต่างๆ
โปรดตอบคำถามด้วยความสุภาพ น่าเชื่อถือ และให้กำลังใจผู้ใช้งาน`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
