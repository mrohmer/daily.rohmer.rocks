import type {PageServerLoad} from './$types';
import {prisma} from '$lib/server/db';


const getDailies = (userid: string|undefined) => {
  if (!userid) {
    return undefined;
  }

  return prisma.session.findMany({
    where: {
      userid
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
}
export const load: PageServerLoad = async ({locals}) => {
  const session = await locals.getSession();

  return {
    dailies: getDailies(session?.user?.id),
  }
}
