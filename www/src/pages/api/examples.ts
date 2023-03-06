import { type NextApiRequest, type NextApiResponse } from 'next';

import { prisma } from '../../server/db/client';

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: 'John Doe' });
};

export default examples;
