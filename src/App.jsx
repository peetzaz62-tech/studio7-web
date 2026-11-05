import Layout from './components/Layout.jsx'
import Events from './pages/Events.jsx'
import About from './pages/About.jsx'
import Project from './pages/Project.jsx'
import Thesis from './pages/Thesis.jsx'
import Submission from './pages/Submission.jsx'
import Alumni from './pages/Alumni.jsx'
import Download from './pages/Download.jsx'
import { NAV } from './data/site.js'
import { THESIS } from './data/thesis.js'
import { useRoute } from './router.js'

const PAGES = NAV.flatMap((n) => (n.children ? n.children : [n])).map((p) => p.id)

function resolve(route) {
  if (route.startsWith('thesis-') && THESIS[route.slice(7)]) return route
  return PAGES.includes(route) ? route : 'events'
}

function Page({ route }) {
  if (route.startsWith('thesis-')) return <Thesis key={route} slug={route.slice(7)} />
  const m = route.match(/^projects-(\d{4})$/)
  if (m) return <Project key={m[1]} year={m[1]} />
  switch (route) {
    case 'about-us': return <About />
    case 'submission': return <Submission />
    case 'alumni': return <Alumni />
    case 'download': return <Download />
    default: return <Events />
  }
}

export default function App() {
  const route = resolve(useRoute())
  return <Layout route={route}><Page route={route} /></Layout>
}
