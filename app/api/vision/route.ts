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

    const { imageBase64 } = await req.json();

    const systemPrompt = `คุณคือ AI เชี่ยวชาญการดูลายมือ (Palmistry)
จงวิเคราะห์ภาพฝ่ามือที่ผู้ใช้ส่งมา โดยเน้นที่เส้นชีวิต (Life Line), เส้นสมอง (Head Line), เส้นหัวใจ (Heart Line) และเส้นวาสนา (Fate Line)
ส่งผลลัพธ์กลับมาในรูปแบบ JSON ดังนี้:
{
  "lifeLine": "คำทำนายเส้นชีวิต",
  "headLine": "คำทำนายเส้นสมอง",
  "heartLine": "คำทำนายเส้นหัวใจ",
  "fateLine": "คำทำนายเส้นวาสนา",
  "overallScore": 90,
  "suggestion": "คำแนะนำเพิ่มเติมที่เชื่อมโยงกับโหราศาสตร์และยามอุบากอง"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Must use a vision capable model
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'โปรดวิเคราะห์ลายมือนี้' },
            { type: 'image_url', image_url: { url: imageBase64 } },
          ],
        },
      ],
      max_tokens: 800,
    });

    const resultText = response.choices[0].message.content || '{}';
    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Vision API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process palm image' },
      { status: 500 }
    );
  }
}
