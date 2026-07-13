/**
 * OPTIONAL backend — only needed if you want to upgrade specific tools from
 * "real classical algorithm" to "true generative AI" quality:
 *   - Object Remover / Magic Eraser / AI Inpainting → Clipdrop Cleanup (contextual fill, not blur)
 *   - AI Outpainting                                 → Clipdrop Uncrop (generative, not mirror-extend)
 *   - Image Upscaler                                 → Clipdrop Image Upscaling (true super-resolution)
 *   - AI Photo Restore                                → Replicate (GFPGAN / old-photo restoration model)
 *   - Colorize Old Photo                               → Replicate (DeOldify / automatic colorization)
 *   - AI Headshot / AI Background Generator            → Replicate or Stability (generative image models)
 *
 * You need your OWN accounts + API keys — these are paid services:
 *   Clipdrop:  https://clipdrop.co/apis  (pay-per-call, has a free tier)
 *   Replicate: https://replicate.com/account/api-tokens (pay-per-second of compute)
 *
 * Deploy this anywhere that can hold secrets (Vercel/Render/Fly.io/your own
 * VPS) — NEVER put these API keys in the frontend index.html, they'd be
 * stolen from the page source immediately.
 *
 * Setup:
 *   npm install
 *   cp .env.example .env   # fill in your real keys
 *   npm start               # runs on http://localhost:3001
 *
 * Then in index.html, point the relevant tool's fetch() call at, e.g.
 * https://your-backend.com/api/cleanup instead of the local canvas function.
 */
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '30mb' }));

const CLIPDROP_KEY = process.env.CLIPDROP_API_KEY || '';
const REPLICATE_KEY = process.env.REPLICATE_API_TOKEN || '';

function requireKey(key, res) {
  if (!key) {
    res.status(500).json({ error: 'Server is missing an API key. Set it in .env and restart.' });
    return false;
  }
  return true;
}

// ---- Clipdrop: Cleanup (contextual object/watermark removal with a mask) ----
// body: { image_base64, mask_base64 }  (mask: white = area to remove)
app.post('/api/cleanup', async (req, res) => {
  if (!requireKey(CLIPDROP_KEY, res)) return;
  try {
    const { image_base64, mask_base64 } = req.body;
    const form = new FormData();
    form.append('image_file', dataUrlToBlob(image_base64), 'image.png');
    form.append('mask_file', dataUrlToBlob(mask_base64), 'mask.png');
    const r = await fetch('https://clipdrop-api.co/cleanup/v1', {
      method: 'POST',
      headers: { 'x-api-key': CLIPDROP_KEY },
      body: form,
    });
    if (!r.ok) throw new Error(await r.text());
    const buf = Buffer.from(await r.arrayBuffer());
    res.json({ image_base64: 'data:image/png;base64,' + buf.toString('base64') });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ---- Clipdrop: Uncrop (generative outpainting) ----
// body: { image_base64, extend_left, extend_right, extend_up, extend_down }
app.post('/api/uncrop', async (req, res) => {
  if (!requireKey(CLIPDROP_KEY, res)) return;
  try {
    const { image_base64, extend_left = 0, extend_right = 0, extend_up = 0, extend_down = 0 } = req.body;
    const form = new FormData();
    form.append('image_file', dataUrlToBlob(image_base64), 'image.png');
    form.append('extend_left', String(extend_left));
    form.append('extend_right', String(extend_right));
    form.append('extend_up', String(extend_up));
    form.append('extend_down', String(extend_down));
    const r = await fetch('https://clipdrop-api.co/uncrop/v1', {
      method: 'POST',
      headers: { 'x-api-key': CLIPDROP_KEY },
      body: form,
    });
    if (!r.ok) throw new Error(await r.text());
    const buf = Buffer.from(await r.arrayBuffer());
    res.json({ image_base64: 'data:image/png;base64,' + buf.toString('base64') });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ---- Clipdrop: true super-resolution upscaling ----
// body: { image_base64, target_width, target_height }
app.post('/api/upscale', async (req, res) => {
  if (!requireKey(CLIPDROP_KEY, res)) return;
  try {
    const { image_base64, target_width = 2048, target_height = 2048 } = req.body;
    const form = new FormData();
    form.append('image_file', dataUrlToBlob(image_base64), 'image.png');
    form.append('target_width', String(target_width));
    form.append('target_height', String(target_height));
    const r = await fetch('https://clipdrop-api.co/image-upscaling/v1/upscale', {
      method: 'POST',
      headers: { 'x-api-key': CLIPDROP_KEY },
      body: form,
    });
    if (!r.ok) throw new Error(await r.text());
    const buf = Buffer.from(await r.arrayBuffer());
    res.json({ image_base64: 'data:image/png;base64,' + buf.toString('base64') });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ---- Replicate: generic model runner (restoration / colorization / headshot) ----
// body: { model_version, input }  — see https://replicate.com/explore for model IDs
// Example model_version for restoration: "tencentarc/gfpgan:<version-hash>"
// Example for colorization: "arielreplicate/deoldify_image:<version-hash>"
app.post('/api/replicate', async (req, res) => {
  if (!requireKey(REPLICATE_KEY, res)) return;
  try {
    const { model_version, input } = req.body;
    const create = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${REPLICATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ version: model_version, input }),
    });
    let prediction = await create.json();
    if (!create.ok) throw new Error(JSON.stringify(prediction));
    // poll until finished (simple synchronous wait — fine for demo scale)
    while (prediction.status === 'starting' || prediction.status === 'processing') {
      await new Promise((r) => setTimeout(r, 1500));
      const poll = await fetch(prediction.urls.get, {
        headers: { Authorization: `Token ${REPLICATE_KEY}` },
      });
      prediction = await poll.json();
    }
    if (prediction.status !== 'succeeded') throw new Error('Prediction failed: ' + JSON.stringify(prediction));
    res.json({ output: prediction.output });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

function dataUrlToBlob(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  return Buffer.from(base64, 'base64');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ImageBoostAI backend listening on :${PORT}`));
