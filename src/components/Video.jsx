// บนเว็บจริงฝัง YouTube ได้; ใน claude.ai artifact (build:artifact) ฝังไม่ได้ จึงแสดงเป็นการ์ดลิงก์แทน
const CAN_EMBED = !import.meta.env.VITE_ARTIFACT

export default function Video({ id, title }) {
  if (CAN_EMBED) {
    return (
      <figure className="video-embed">
        <div className="ratio">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <figcaption>{title}</figcaption>
      </figure>
    )
  }
  return (
    <a className="video-card" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">
      <span className="play" aria-hidden="true" />
      <span className="video-title">{title}</span>
      <span className="video-cta">ดูบน YouTube ↗</span>
    </a>
  )
}
