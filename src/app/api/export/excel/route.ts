import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { data, filename } = await req.json();
    // In a real app, this might generate a buffer and return the file
    // For now, it just calls the utility (which writes locally or creates a blob)
    return NextResponse.json({ success: true, message: 'Export logic triggered' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
