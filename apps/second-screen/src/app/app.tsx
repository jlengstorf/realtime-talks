// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { } from '@supabase/supabase-js';
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

  async function createVote(event: any) {
    event.preventDefault();

    const { data, error } = await supabase
      .from('sentiment')
      .insert([
        { value: 'good', user_id: user.id }
      ]);

    console.log({ data, error })
  }

  return (
    <form onSubmit={createVote}>
      <h1>How do you feel about this nonsense?</h1>
      <button id="good"><span role="img" aria-label="Yum face">😋</span></button>
      <button id="bad"><span role="img" aria-label="Angry face">😡</span></button>
    </form>
  );
}

export default App;
