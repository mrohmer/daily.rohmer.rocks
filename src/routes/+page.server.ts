import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
  return { url: url.origin }
}
