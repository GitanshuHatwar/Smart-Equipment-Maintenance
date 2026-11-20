import { Activity, ArrowLeft, LayoutDashboard, Microscope } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

export function Brand() {
  return <Link to="/" className="brand" aria-label="MaintiX home"><span className="brand-mark"><Microscope size={19} strokeWidth={2.2} /></span><span>Mainti<span className="brand-x">X</span></span></Link>
}

export function Sidebar({ active = 'dashboard' }: { active?: 'dashboard' | 'device' }) {
  return <aside className="sidebar"><Brand /><div className="sidebar-divider" /><p className="sidebar-label">WORKSPACE</p><nav className="side-nav" aria-label="Main navigation">
    <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><LayoutDashboard size={17} /><span>Dashboard</span></NavLink>
    {active === 'device' && <NavLink to="#details" className="nav-link active"><Activity size={17} /><span>Device health</span></NavLink>}
  </nav><div className="sidebar-bottom"><div className="sidebar-divider" /><div className="profile"><div className="avatar">MP</div><div className="profile-info"><strong>Maya Patel</strong><span>Lab technician</span></div><span className="online-dot" /></div></div></aside>
}

export function BackLink() { return <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to dashboard</Link> }
