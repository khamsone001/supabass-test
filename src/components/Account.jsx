import { supabase } from '../lib/supabase'
import ScheduleBoard from './ScheduleBoard'

export default function Account({ session, profile }) {
  return (
    <>
      <div className="container">
        <div className="card profile-card">
          <h1>Welcome!</h1>
          <div className="email-tag">{session.user.email}</div>
          
          <div className="info-box">
            <small>USER ID</small>
            <code>{session.user.id}</code>
            <small style={{ marginTop: '10px' }}>ROLE</small>
            <code style={{ color: profile?.role === 'admin' ? '#3b82f6' : '#94a3b8' }}>
              {profile?.role?.toUpperCase() || 'USER'}
            </code>
          </div>

          <button 
            className="outline" 
            onClick={() => supabase.auth.signOut()}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      <ScheduleBoard profile={profile} session={session} />
    </>
  )
}
