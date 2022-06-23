// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './app.module.css';

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://ngtysgnufzpmktudxyvx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndHlzZ251ZnpwbWt0dWR4eXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ3OTU3MTcsImV4cCI6MTk3MDM3MTcxN30.VxNKyl8_Xm2ogaXyJlrGr-6wAhyXnu45obVovZlVotQ')


export function App() {
  const [ user, setUser ] = useState<any>();

  async function signInWithGithub() {
    const { error } = await supabase.auth.signIn({
      provider: 'github',
    })

    if(error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    async function loadUser() {
      const user = supabase.auth.user();
      setUser(user);
    }

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    loadUser();
  }, [])

  if (!user) {
    return <button onClick={signInWithGithub}>Sign In</button>
  }

  async function createGoodVote(event: any) {
    event.preventDefault();

    await createVote('good');
  }


  async function createBadVote(event: any) {
    event.preventDefault();

    await createVote('bad');
  }

  async function createVote(value: string) {
    await supabase
      .from('sentiment')
      .insert({ value, user_id: user.id });
  }

  return (
    <form>
      <h1>How do you feel about this nonsense?</h1>
      <button onClick={createGoodVote}><span role="img" aria-label="Yum face">😋</span></button>
      <button onClick={createBadVote}><span role="img" aria-label="Angry face">😡</span></button>
    </form>
  );
}

export default App;
