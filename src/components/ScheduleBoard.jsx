import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ScheduleBoard({ profile, session }) {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    fetchSchedules()
    
    // Realtime updates
    const subscription = supabase
      .channel('public:schedules')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, fetchSchedules)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  async function fetchSchedules() {
    setLoading(true)
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })
    
    if (!error) setSchedules(data)
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    const { error } = await supabase
      .from('schedules')
      .insert([
        { 
          title, 
          description, 
          date, 
          time, 
          created_by: session.user.id 
        }
      ])

    if (error) {
      alert(error.message)
    } else {
      setShowForm(false)
      setTitle('')
      setDescription('')
      setDate('')
      setTime('')
    }
  }

  return (
    <div className="schedule-container">
      <div className="header">
        <h2>ตารางงานทั้งหมด</h2>
        {profile?.role === 'admin' && (
          <button className="primary small" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'ยกเลิก' : '+ สร้างตารางงาน'}
          </button>
        )}
      </div>

      {showForm && profile?.role === 'admin' && (
        <form className="admin-form card" onSubmit={handleCreate}>
          <h3>สร้างตารางงานใหม่</h3>
          <div className="input-group">
            <label>หัวข้อ</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="เช่น ประชุมเช้า" />
          </div>
          <div className="input-group">
            <label>รายละเอียด</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="รายละเอียดเพิ่มเติม..." />
          </div>
          <div className="row">
            <div className="input-group">
              <label>วันที่</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>เวลา</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="primary">บันทึกตารางงาน</button>
        </form>
      )}

      <div className="schedule-list">
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : schedules.length === 0 ? (
          <p className="empty-msg">ยังไม่มีตารางงานในขณะนี้</p>
        ) : (
          schedules.map(item => (
            <div key={item.id} className="schedule-card">
              <div className="card-header">
                <span className="date-badge">{new Date(item.date).toLocaleDateString('th-TH')}</span>
                <span className="time-badge">{item.time.substring(0, 5)} น.</span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
