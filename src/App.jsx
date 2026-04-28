import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth.jsx'
import Account from './components/Account.jsx'

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (!error) setProfile(data)
  }

  return (
    <div className="app">
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} profile={profile} onProfileUpdate={() => fetchProfile(session.user.id)} />
      )}
    </div>
  )
}

export default App
