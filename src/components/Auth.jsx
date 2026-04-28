import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
    } else if (!isLogin) {
      alert('เช็คอีเมลของคุณเพื่อยืนยันการสมัคร!')
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
        <p className="subtitle">ยินดีต้อนรับสู่ระบบทดสอบ Supabase</p>
        
        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label>อีเมล</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button className="primary" disabled={loading}>
            {loading ? 'กำลังโหลด...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
          </button>
        </form>

        <a className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
        </a>
      </div>
    </div>
  )
}
