import type {PageServerLoad} from "./$types";
import {prisma} from '$lib/server/db';
import {error} from '@sveltejs/kit';
import {validate} from 'uuid';

export const load: PageServerLoad = async ({params, depends}) => {
  if (!validate(params.sessionKey)) {
    throw error(404);
  }

  const daily = await prisma.session.findUnique({
    where: {
      id: params.sessionKey,
    },
    include: {
      participants: {
        orderBy: {
          name: 'asc'
        }
      },
    }
  });

  if (!daily) {
    throw error(404);
  }

  depends(`daily:${daily.id}`);

  return {
    daily,
  }
}
