import type {PageServerLoad} from './$types';
import {redirect} from '@sveltejs/kit';

export const load: PageServerLoad = async ({url, locals}) => {
  const session = await locals.getSession();

  if (session) {
    throw redirect(301, '/');
  }

  return {url: url.origin}
}
