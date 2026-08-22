import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

export async function extractDocumentData(prompt: string, base64Image: string) {
  if (!apiKey) {
    // Safe structured simulation for local testing when API key is not configured
    return JSON.stringify({
      documentType: 'rate_confirmation',
      loadNumber: 'FF-88902',
      carrierName: 'Titan Freight Lines LLC',
      carrierMC: '1049281',
      shipperName: 'Apex Cold Foods',
      origin: {
        facility: 'Dallas Cold Hub',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
      },
      destination: {
        facility: 'Kroger Distribution Center #12',
        city: 'Atlanta',
        state: 'GA',
        zip: '30301',
      },
      financials: {
        linehaulRate: 3100.0,
        fuelSurcharge: 420.0,
        accessorials: 0.0,
        totalAmount: 3520.0,
      },
      equipment: 'Reefer (53ft)',
      temperature: '-10°F Continuous',
      confidenceScore: 98.4,
      signeeName: 'Marcus Vance',
      signatureTimestamp: new Date().toISOString(),
    });
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${prompt}\nReturn extracted data strictly in structured JSON format.` },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
  });

  return response.text;
}
