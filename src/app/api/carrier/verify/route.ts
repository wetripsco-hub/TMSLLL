import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dotNumber = searchParams.get('dot_number');
    const mcNumber = searchParams.get('mc_number');

    if (!dotNumber && !mcNumber) {
      return NextResponse.json(
        { error: 'Must provide either dot_number or mc_number' },
        { status: 400 }
      );
    }

    // MOCK: Simulate fetching from FMCSA SAFER / API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network latency

    // MOCK LOGIC: We will generate some deterministic mock data based on the input
    const seed = parseInt((dotNumber || mcNumber || '0').replace(/\D/g, ''), 10);
    const isValid = !isNaN(seed);

    if (!isValid) {
       return NextResponse.json(
        { error: 'Invalid dot_number or mc_number format' },
        { status: 400 }
      );
    }

    // Mock response structure matching requirements
    const mockResponse = {
      company_name: `Carrier ${seed} Logistics LLC`,
      dot_number: dotNumber || `1${seed.toString().padStart(6, '0')}`,
      mc_number: mcNumber || `MC${seed.toString().padStart(6, '0')}`,
      safety_rating: (seed % 3 === 0 ? 'Satisfactory' : seed % 3 === 1 ? 'Conditional' : 'None') as 'Satisfactory' | 'Conditional' | 'Unsatisfactory' | 'None',
      operating_status: (seed % 5 === 0 ? 'Inactive' : seed % 4 === 0 ? 'Unauthorized' : 'Active') as 'Active' | 'Inactive' | 'Unauthorized',
      insurance_on_file: seed % 7 !== 0,
      insurance_expiry_date: seed % 7 !== 0 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString() : null, // 180 days from now if on file
      physical_address: '123 Freight Way, Transport City, TX 75001',
      phone: '800-555-0199',
    };

    // Simulate an occasional "Carrier Not Found" error for realistic behavior if seed ends in 99
    if (seed % 100 === 99) {
      return NextResponse.json(
        { error: 'Carrier not found in FMCSA registry' },
        { status: 404 }
      );
    }

    return NextResponse.json(mockResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('FMCSA Verification Error:', message);
    return NextResponse.json(
      { error: 'Failed to verify carrier with FMCSA' },
      { status: 500 }
    );
  }
}
