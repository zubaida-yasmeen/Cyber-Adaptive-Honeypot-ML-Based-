import { NextResponse } from 'next/server';
import { runPrediction, type NetworkRequest } from '@/lib/ml-engine';

export async function POST(request: Request) {
  try {
    const body: NetworkRequest = await request.json();
    const result = runPrediction(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 400 });
  }
}

export async function GET() {
  const mockRequests: NetworkRequest[] = [
    { frequency: 10, payload_size: 500, special_chars: 0, path_type: 'GET' },
    { frequency: 150, payload_size: 2048, special_chars: 12, path_type: 'POST' },
    { frequency: 45, payload_size: 1024, special_chars: 4, path_type: 'PUT' },
  ];
  
  const randomReq = mockRequests[Math.floor(Math.random() * mockRequests.length)];
  const result = runPrediction(randomReq);
  
  return NextResponse.json({
    ...result,
    input: randomReq
  });
}
