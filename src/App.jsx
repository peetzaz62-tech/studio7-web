import { lazy, Suspense, useEffect } from 'react'
import Layout from './components/Layout.jsx'
import Events from './pages/Events.jsx'
import About from './pages/About.jsx'
import Project from './pages/Project.jsx'
import Thesis from './pages/Thesis.jsx'
import Submission from './pages/Submission.jsx'
import Alumni from './pages/Alumni.jsx'
import Download from './pages/Download.jsx'
import NotFound from './pages/NotFound.jsx'
import { ContentProvider, useContent } from './content.jsx'
import { usePath } from './router.js'
import { parsePath } from './routes.js'
import { metaFor } from './meta.js'

const Admin = lazy(() => import('./admin/Admin.jsx'))

// หน้าไหนเปิดส่วนไหนของ dashboard
function editLinkFor(r) {
  switch (r.page) {
    case 'events': return '/admin?s=events'
    case 'about-us': return '/admin?s=about'
    case 'project': return `/admin?s=projects&k=${r.year}`
    case 'thesis': return `/admin?s=thesis&k=${r.slug}`
    case 'submission': return '/admin?s=submission'
    case 'alumni': return '/admin?s=alumni'
    case 'download': return '/admin?s=download'
    default: return null
  }
}

function Page({ r }) {
  switch (r.page) {
    case 'events': return <Events />
    case 'about-us': return <About />
    case 'project': return <Project key={r.year} year={r.year} />
    case 'thesis': return <Thesis key={r.slug} slug={r.slug} />
    case 'submission': return <Submission />
    case 'alumni': return <Alumni />
    case 'download': return <Download />
    default: return <NotFound />
  }
}

function Site() {
  const path = usePath()
  const content = useContent()
  const r = parsePath(path, content)
  useEffect(() => { document.title = metaFor(r, content).title }, [path, content])

  if (r.page === 'admin') {
    return <Suspense fallback={<p className="admin-loading">กำลังโหลด…</p>}><Admin /></Suspense>
  }
  return (
    <Layout path={path} overHero={r.page === 'events'} editLink={editLinkFor(r)}>
      <Page r={r} />
    </Layout>
  )
}

export default function App() {
  return <ContentProvider><Site /></ContentProvider>
}
