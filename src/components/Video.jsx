export default function Video({ id, title }) {
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
