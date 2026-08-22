import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    const { birthDate, birthTime, birthPlace, gender } = await req.json();

    const systemPrompt = `คุณคือ AI นักโหราศาสตร์และผู้เชี่ยวชาญด้านยามอุบากอง
จงวิเคราะห์ข้อมูลพื้นดวงชะตาจาก วันเกิด, เวลาเกิด, สถานที่เกิด และเพศที่ให้มา
ส่งผลลัพธ์กลับมาในรูปแบบ JSON ดังนี้:
{
  "powerRating": 4, // คะแนน 1-5
  "workRating": 5, // คะแนน 1-5
  "financeRating": 4, // คะแนน 1-5
  "travelRating": 3, // คะแนน 1-5
  "relationRating": 4, // คะแนน 1-5
  "summary": "บทวิเคราะห์พื้นดวงภาพรวม และคำแนะนำการใช้ยามอุบากองให้สอดคล้องกับดวงชะตา"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `ข้อมูลเกิด: 
วันที่: ${birthDate} 
เวลา: ${birthTime || 'ไม่ระบุ'} 
สถานที่: ${birthPlace || 'ไม่ระบุ'} 
เพศ: ${gender || 'ไม่ระบุ'}`
        },
      ],
      max_tokens: 500,
    });

    const resultText = response.choices[0].message.content || '{}';
    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process birth profile' },
      { status: 500 }
    );
  }
}
