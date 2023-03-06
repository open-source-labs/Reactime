import { z } from 'zod';

import { router, publicProcedure } from '../trpc';

export const userRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    ) // name and email
    .mutation(async ({ input, ctx }) => {
      // we want to add to our database with the name, email, admin defaulted to false as column values
      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });
    }),
  findAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
});

//const greeting = trpc.userRouter.hello({text: ""});

/**
 * hello -- name of endpoint api
 * .input will be what we are going to be expecting
 * .query/.mutation will be what is going to happen once we go to this endpoint api
 * (differentiation is that query and mutation should be adjusted for read and CUD functionality)
 */
