import Logo from '../components/Logo.jsx'

export default function NotFound() {
  return (
    <section className="notfound">
      <Logo variant="outline" className="notfound-mark" />
      <div className="wrap">
        <p className="mono hero-in" style={{ '--d': 0 }}>404 · water level too high</p>
        <h1 className="hero-in" style={{ '--d': 1 }}>ไม่พบหน้านี้</h1>
        <p className="hero-in" style={{ '--d': 2 }}>ลิงก์อาจเปลี่ยนไปแล้ว หรือพิมพ์ที่อยู่ผิด</p>
        <a className="btn btn-light hero-in" style={{ '--d': 3 }} href="/">กลับหน้าแรก <i>→</i></a>
      </div>
    </section>
  )
}
