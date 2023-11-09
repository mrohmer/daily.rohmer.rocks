<script lang="ts">
  import daisyuiColors from 'daisyui/src/theming/themes';
  import {ThemeSupa} from "@supabase/auth-ui-shared";
  import {Auth} from "@supabase/auth-ui-svelte";
  import type {PageData} from './$types';
  import {browser} from '$app/environment';

  export let data: PageData;

  $: clientUrl = browser ? `${window.location.protocol}//${window.location.host}` : undefined;
  $: url = clientUrl ?? data?.url;
</script>

<div class="container mx-auto">
    <div class="flex h-screen items-center justify-center gap-4">
        <div class="card w-96 bg-base-100 border-primary border shadow shadow-primary">
            <div class="card-body">
                {#if !data?.session}
                    <div class="alert shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             class="stroke-info shrink-0 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h3 class="font-bold">Signups are currently disabled</h3>
                            <div class="text-xs">Reach out to the admin of your trust to get access 😉</div>
                        </div>
                    </div>
                    <Auth supabaseClient={data.supabase}
                          view="magic_link"
                          redirectTo={`${url}/auth/callback`}
                          showLinks={false}
                          appearance={{
                              theme: ThemeSupa,
                              extend: true,
                              className: {
                                button: 'btn btn-primary',
                              },
                              variables: {
                                default: {
                                  colors: {
                                    brand: daisyuiColors["[data-theme=dark]"].primary,
                                    brandAccent: daisyuiColors["[data-theme=dark]"].primary,
                                  },
                                },
                              },
                            }}
                          theme="dark"
                    />
                {/if}
            </div>
        </div>
    </div>
</div>
