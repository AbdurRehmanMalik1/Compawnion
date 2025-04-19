import express, { Request, Response } from 'express';

const app = express();
const PORT : string = process.env.PORT || '3000';

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
