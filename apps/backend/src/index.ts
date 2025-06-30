import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/backend';
import { buffer } from 'micro';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Webhook handler für Clerk Events
app.post('/api/webhooks/clerk', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing webhook headers' });
  }

  const payload = JSON.stringify(req.body);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Error verifying webhook' });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with ID ${id} and type ${eventType}`);

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          firstName: first_name || '',
          lastName: last_name || '',
        },
      });

      console.log('Created new user:', user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Error creating user' });
    }
  }

  res.status(200).json({ message: 'Webhook processed successfully' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 