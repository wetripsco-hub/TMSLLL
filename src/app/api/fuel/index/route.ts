import { NextResponse } from 'next/server';
import { getLiveFuelIndex, calculateFuelSurcharge } from '@/lib/scrapers/fuel_index';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const miles = searchParams.get('miles');

    const indexData = await getLiveFuelIndex();

    if (miles) {
      const calculation = calculateFuelSurcharge(
        Number(miles),
        indexData.nationalAverageDiesel,
        indexData.baselinePrice,
        indexData.standardMpg
      );
      return NextResponse.json({ success: true, index: indexData, calculation });
    }

    return NextResponse.json({ success: true, index: indexData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
