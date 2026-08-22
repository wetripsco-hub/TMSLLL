import { NextResponse } from 'next/server';
import { scrapeFMCSARecord } from '@/lib/scrapers/fmcsa_scraper';

export async function POST(req: Request) {
  try {
    const { mcNumber } = await req.json();
    if (!mcNumber) {
      return NextResponse.json({ success: false, error: 'MC Number or USDOT Number required' }, { status: 400 });
    }

    const carrierVerification = await scrapeFMCSARecord(mcNumber);
    return NextResponse.json({ 
      success: true, 
      verified: carrierVerification.authorityStatus === 'AUTHORIZED', 
      carrier: carrierVerification 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
