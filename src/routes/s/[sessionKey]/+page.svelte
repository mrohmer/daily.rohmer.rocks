<script lang="ts">
  import type {PageData} from './$types';
  import Card from './_/components/Card.svelte';
  import {v4 as uuid} from 'uuid';
  import {invalidate} from '$app/navigation';
  import ms from 'ms';
  import {onMount} from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Title from './_/components/Title.svelte';

  export let data: PageData;

  let addedUsers = 0;
  let deletedParticipants = [];

  const execInvalidate = async () => {
    if (addedUsers <= 1 && deletedParticipants?.length <= 1) {
      await invalidate(`daily:${data.daily.id}`)
    }
  }
  const addParticipant = async (name: string) => {
    const {data: result, error} = await data.supabase
      .from('Participant')
      .insert([
        {userid: data.session.user.id, name, id: uuid(), sessionId: data.daily.id},
      ])
      .select();

    if (error) {
      throw error;
    }

    return result?.[0];
  }
  const deleteParticipant = async (id: string) => {
    const {error} = await data.supabase
      .from('Participant')
      .delete()
      .eq('id', id)
      .eq('userid', data.session.user.id)
      .eq('sessionId', data.daily.id)
    ;

    if (error) {
      throw error;
    }
  }
  const changeCheckValue = async (id: string, checked: boolean) => {
    const {data: result, error} = await data.supabase
      .from('Participant')
      .update({checked: checked ? new Date() : null})
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return result?.[0];
  }
  const changeTitle = async (id: string, title: string) => {
    const {data: result, error} = await data.supabase
      .from('Session')
      .update({title})
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return result?.[0];
  }

  const onAdd = () => async ({detail}) => {
    addedUsers++;
    try {
      await addParticipant(detail);

      await execInvalidate();
    } finally {
      addedUsers--;
    }
  }
  const onCheck = (id: string) => async ({detail}) => {
    const original = data.daily.participants.find(participant => participant.id === id)?.checked;
    data.daily.participants = data.daily.participants.map(
      particpant => particpant.id === id ? {...particpant, checked: detail ? new Date() : undefined} : particpant
    )
    try {
      await changeCheckValue(id, detail);
    } catch (e) {
      data.daily.participants = data.daily.participants.map(
        particpant => particpant.id === id ? {...particpant, checked: original} : particpant
      )
      throw e;
    }
  }
  const onDelete = (id: string) => async () => {
    if (deletedParticipants.includes(id)) {
      return;
    }
    deletedParticipants = [
      ...deletedParticipants,
      id,
    ];
    try {
      await deleteParticipant(id);

      await execInvalidate();
    } finally {
      deletedParticipants = deletedParticipants.filter(p => p.id === id);
    }
  }

  const subscribe = <T>(
    f: Record<'table' | 'filter' | 'event', string>,
    cb: (payload: T) => void,
  ) => {
    const {event, table, filter} = f;
    return data.supabase
      .channel(`changes-${table}-${event}`)
      .on(
        'postgres_changes',
        {event, table, filter, schema: 'public'},
        cb,
      )
      .subscribe(console.log)
  }

  onMount(() => {
    const subs = [
      subscribe(
        {
          event: '*',
          table: 'Participant',
          filter: `sessionId=eq.${data.daily.id}`
        },
        (payload) => {
          invalidate(`daily:${data.daily.id}`)
        },
      ),
      subscribe(
        {
          event: 'UPDATE',
          table: 'Session',
          filter: `id=eq.${data.daily.id}`
        },
        (payload) => {
          invalidate(`daily:${data.daily.id}`)
        },
      ),
    ];

    return () => {
      subs.forEach(s => s.unsubscribe());
    }
  });
  const onChangeTitle = () => async () => {
    await changeTitle(data.daily.id, data.daily.title);
  }

  $: canEdit = !!data.session?.user?.id
</script>

<Navbar backLink="/">
    {#if data.daily}
        <Title bind:title={data.daily.title} {canEdit} on:change={onChangeTitle()}/>
    {/if}
</Navbar>

<div class="container mx-auto">
    <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4">
        {#if data.daily.participants?.length}
            {#each data.daily.participants as {id, name, checked} (id)}
                {#if !deletedParticipants.includes(id)}
                    <Card canCheck={canEdit}
                          canDelete={canEdit}
                          checked={checked && checked - +new Date() < ms('22h')}
                          on:check={onCheck(id)}
                          on:delete={onDelete(id)}
                    >{name}</Card>
                {/if}
            {/each}
        {/if}
        {#each Array.from(Array(addedUsers)) as _, index (index)}
            <Card loading/>
        {/each}
        {#if data.session?.user?.id}
            <Card edit on:add={onAdd()}/>
        {/if}
    </div>
</div>
