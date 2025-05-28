// app/api/collector/route.ts (Next.js 14 App Router)
// ou api/collector.ts se estiver fora do App Router

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// --- Fluid Compute: habilita Node e define limites -----------------
export const runtime = "nodejs"; // garante micro-VM Node
export const maxDuration = 30; // seg. (até 300)  [oai_citation:0‡Vercel](https://vercel.com/docs/functions/functions-api-reference?utm_source=chatgpt.com)
export const concurrency = 50; // máx. de requisições por instância
// -------------------------------------------------------------------

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
  const event = await req.json(); // CloudEvent vindo do front

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `tracking/${crypto.randomUUID()}.json`,
      Body: JSON.stringify(event),
      ContentType: "application/json",
    })
  );

  return new Response(null, { status: 204 });
}
