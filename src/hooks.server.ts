import {PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY} from '$env/static/public'
import {createSupabaseServerClient} from '@supabase/auth-helpers-sveltekit'
import {redirect, type Handle} from '@sveltejs/kit'
import {sequence} from '@sveltejs/kit/hooks';


const enforceAuth: Handle = async ({event, resolve}) => {
  if (event.route.id?.startsWith('/(authenticated)')) {
    const session = await event.locals.getSession()

    if (!session) {
      throw redirect(303, '/')
    }
  }

  return resolve(event);
}

const init: Handle = async ({event, resolve}) => {
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event,
  })

  /**
   * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
   */
  event.locals.getSession = async () => {
    const {
      data: {session},
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    },
  })
}

export const handle = sequence(init, enforceAuth);
