import { NextResponse } from 'next/server';
import { extractDocumentData } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { base64Image, prompt } = await req.json();
    const result = await extractDocumentData(prompt, base64Image);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
