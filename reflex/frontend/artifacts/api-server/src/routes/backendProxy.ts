import { Router, Request, Response } from 'express';

const router = Router();

router.all('/proxy/*', async (req: Request, res: Response) => {
  const targetUrl = req.headers['x-target-url'] as string;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing X-Target-URL header' });
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' ? { body: JSON.stringify(req.body) } : {}),
    };

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Backend proxy error:', error);
    return res.status(500).json({ error: 'Proxy forwarding failed', details: error.message });
  }
});

export default router;