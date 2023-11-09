<script lang="ts">
  import type {PageData} from './$types';
  import Card from './_/components/Card.svelte';
  import {v4 as uuid} from 'uuid';
  import {invalidate} from '$app/navigation';
  import ms from 'ms';
  import {onMount} from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Title from './_/components/Title.svelte';
  import Absent from './_/components/Absent.svelte';

  export let data: PageData;

  let addedUsers = 0;
  let deletedParticipants = [];

  const getNextDayMidnight = () => {
    const date = new Date(+new Date() + ms('1d'));
    date.setHours(1);
    return date;
  }
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
  const setAbsent = async (id: string, absent = getNextDayMidnight()) => {
    const {data: result, error} = await data.supabase
      .from('Participant')
      .update({absent})
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
  const onMakeAbsent = (id: string) => async () => {
    try {
      data.daily.participants = data.daily.participants.map(p => p.id === id ? {
        ...p,
        absent: getNextDayMidnight()
      } : p)
      await setAbsent(id);
    } catch (e) {
      data.daily.participants = data.daily.participants.map(p => p.id === id ? {
        ...p,
        absent: undefined,
      } : p)
      throw e;
    }
  }
  const onChangeAbsent = (id: string, change: 1|-1) => async () => {
    const participant = data.daily.participants.find(p => p.id === id);
    const adjustedParticipant = {
      ...participant,
      absent: new Date(+participant.absent + (ms('1d') * change)),
    };
    try {
      data.daily.participants = data.daily.participants.map(p => p.id === id ? adjustedParticipant : p)
      await setAbsent(id, adjustedParticipant.absent);
    } catch (e) {
      data.daily.participants = data.daily.participants.map(p => p.id === id ? participant : p)
      throw e;
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

  const isAbsent = (date: Date): boolean =>
    !!date && Math.ceil((date - +new Date()) / ms('1d')) >= 1;

  $: canEdit = !!data.session?.user?.id;

  $: participants = data.daily?.participants?.filter(p => !deletedParticipants.includes(p.id) && !isAbsent(p.absent));
  $: absentParticipants = data.daily?.participants?.filter(p => !deletedParticipants.includes(p.id) && isAbsent(p.absent));
</script>

<svelte:head>
    <title>{data.daily?.title ?? ''} | Daily Checklist</title>
</svelte:head>

<Navbar backLink="/">
    {#if data.daily}
        <Title bind:title={data.daily.title} {canEdit} on:change={onChangeTitle()}/>
    {/if}
</Navbar>

<div class="container mx-auto p-4 flex flex-col gap-10">
    <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {#if participants?.length}
            {#each participants as {id, name, checked, absent} (id)}
                <Card canCheck={canEdit}
                      {canEdit}
                      checked={checked && checked - +new Date() < ms('22h')}
                      on:check={onCheck(id)}
                      on:delete={onDelete(id)}
                      on:absent={onMakeAbsent(id)}
                >{name}</Card>
            {/each}
        {/if}
        {#each Array.from(Array(addedUsers)) as _, index (index)}
            <Card loading/>
        {/each}
        {#if data.session?.user?.id}
            <Card edit on:add={onAdd()}/>
        {/if}
    </div>

    {#if absentParticipants?.length}
        <div class="grid grid-cols-1  gap-4 justify-center opacity-75"
             class:sm:grid-cols-2={!canEdit}
             class:md:grid-cols-3={!canEdit}
             class:md:grid-cols-2={canEdit}
             class:lg:grid-cols-3={canEdit}
        >
            {#each absentParticipants as {id, name, absent} (id)}
                <Absent {absent} {canEdit}
                        on:increment={onChangeAbsent(id, 1)}
                        on:decrement={onChangeAbsent(id, -1)}
                >
                    {name}
                </Absent>
            {/each}
        </div>
    {/if}
</div>
