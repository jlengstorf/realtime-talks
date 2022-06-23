// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';

import styles from './app.module.css';

// Create a single supabase client for interacting with your database
const supabase = createClient('https://ngtysgnufzpmktudxyvx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndHlzZ251ZnpwbWt0dWR4eXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ3OTU3MTcsImV4cCI6MTk3MDM3MTcxN30.VxNKyl8_Xm2ogaXyJlrGr-6wAhyXnu45obVovZlVotQ')

export function App() {
  const [currentSentiment, setCurrentSentiment] = useState(50);

  useEffect(() => {
    const mySubscription = supabase
      .from('sentiment')
      .on('INSERT', payload => {
        console.log('Change received!', payload)
        const {value} = payload.new;
        setCurrentSentiment((currentVal) => {

          const incValue = value === 'bad' ? -1 : 1;
          const newValue = Math.min(100, Math.max(0, currentVal + incValue));

          return newValue;
        });
      })
      .subscribe()

      return () => {
        supabase.removeSubscription(mySubscription)
      }
  }, []);

  return (
    <div className={styles['slide']}>
      <h1>Hot dogs are my favorite sandwich.</h1>
      <p className={styles['big-text']}><span role="img" aria-label="Hot dog">🌭</span></p>

      <div className={styles['responses']}>
        <h2>How the audience is feeling</h2>

        <div className={styles['sentiment-container']}>
          <p>
            <span role="img" aria-label="Angry face">😡</span>
          </p>

          <label htmlFor="sentiment" className="visually-hidden">
            Current sentiment
          </label>
          <input
            type="range"
            id="sentiment"
            min="0"
            max="100"
            value={currentSentiment}
            readOnly
            className={styles['sentiment']}
          />

          <p>
            <span role="img" aria-label="Yum face">😋</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
