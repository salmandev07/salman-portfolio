'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, useMotionTemplate } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, ArrowRight, ArrowUpRight, Code2, Database, Cloud, Wrench, GraduationCap, Briefcase, Menu, X, Rocket, GitBranch, Brain, ArrowUp, Terminal, Heart, Server, Sun, Moon, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast, Toaster } from 'sonner'
import Lenis from 'lenis'
import { ThemeProvider, useTheme } from './ThemeProvider'

const PROFILE_IMG = 'https://customer-assets.emergentagent.com/job_76bd5acf-3a89-4f54-b6a6-bf23007e7357/artifacts/lcgvrsmx_Gemini_Generated_Image_r3l10qr3l10qr3l1.png'

const SPRING = { type: 'spring', stiffness: 58, damping: 32, mass: 1.1 }
const SPRING_FAST = { type: 'spring', stiffness: 190, damping: 28, mass: 0.85 }
const SCROLL_SPRING = { stiffness: 80, damping: 30, mass: 0.6, restDelta: 0.0001 }

export const scrollToTarget = (target, { useLenis = true, immediate = false } = {}) => {
  if (typeof window === 'undefined') return

  if (useLenis && window.__portfolioLenis?.scrollTo) {
    window.__portfolioLenis.scrollTo(target, { 
      offset: target === 0 ? 0 : -80, 
      immediate: immediate || false
    })
    if (typeof target === 'string') window.history.pushState(null, '', target)
  }
}

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

const TYPING_ROLES = [
  'Full Stack Developer',
  'React Engineer',
  'Django Specialist',
  'Problem Solver',
  'MSc Computer Science',
]

const STATS = [
  { value: 2, suffix: '+', label: 'GitHub Repos' },
  { value: 1, suffix: '+', label: 'Years Coding' },
  { value: 12, suffix: '+', label: 'Technologies' },
  { value: 100, suffix: '%', label: 'Dedication' },
]

const SKILLS = {
  Frontend: [
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Next.js', level: 78 },
    { name: 'Tailwind CSS', level: 88 },
    { name: 'JavaScript', level: 88 },
    { name: 'HTML/CSS', level: 90 },
  ],
  Backend: [
    { name: 'Django REST', level: 85 },
    { name: 'Flask', level: 80 },
    { name: 'Node.js', level: 72 },
    { name: 'Python', level: 88 },
    { name: 'REST APIs', level: 82 },
  ],
  Databases: [
    { name: 'PostgreSQL', level: 80 },
    { name: 'MySQL', level: 82 },
    { name: 'MongoDB', level: 72 },
  ],
  DevOps: [
    { name: 'Docker', level: 75 },
    { name: 'Git / GitHub', level: 88 },
    { name: 'Linux', level: 75 },
  ],
  Tools: [
    { name: 'VS Code', level: 90 },
    { name: 'Postman', level: 85 },
    { name: 'Machine Learning', level: 70 },
  ],
}

const SKILL_ICONS = {
  Frontend: Code2,
  Backend: Server,
  Databases: Database,
  DevOps: Cloud,
  Tools: Wrench,
}

const PROJECTS = [
  {
    name: 'DevFlow',
    tagline: 'Full Stack Project Management Platform',
    description:
      'A modern collaborative project management platform with real-time updates, Kanban boards, sprint planning, and team analytics. Built with a scalable microservice-friendly architecture.',
    problem: 'Teams struggle with fragmented tools — tasks in one place, docs in another, chat scattered. Productivity dies in context switches.',
    solution: 'A unified workspace combining boards, docs, sprints, and analytics with real-time sync and role-based access control.',
    features: ['Real-time Kanban', 'Sprint Planning', 'Role-based Access', 'Analytics Dashboard', 'REST API'],
    tech: ['React', 'TypeScript', 'Django REST', 'PostgreSQL', 'Docker'],
    metrics: [{ k: '99.9%', v: 'Uptime' }, { k: '<150ms', v: 'API Latency' }, { k: '10+', v: 'Modules' }],
    github: 'https://github.com/salmandev07',
    demo: '#',
    gradient: 'from-emerald-500 via-cyan-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'AUTOSERVE',
    tagline: 'Smart Vehicle Service Booking & Management',
    description:
      'An intelligent vehicle service platform that predicts maintenance needs using ML, lets users book service slots, track work, and view a complete vehicle history.',
    problem: 'Vehicle service booking is still phone-call driven, with no predictive insights or transparent tracking for owners.',
    solution: 'An end-to-end booking system with ML-powered maintenance predictions, live job tracking, and an admin dashboard for service centers.',
    features: ['ML Maintenance Predictions', 'Online Booking', 'Service History', 'Admin Dashboard', 'Invoice Generation'],
    tech: ['Flask', 'MySQL', 'JavaScript', 'HTML/CSS', 'Machine Learning'],
    metrics: [{ k: '85%', v: 'ML Accuracy' }, { k: '4x', v: 'Faster Booking' }, { k: '24/7', v: 'Available' }],
    github: 'https://github.com/salmandev07',
    demo: '#',
    gradient: 'from-teal-500 via-emerald-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=80',
  },
]

const EXPERIENCE = [
  { year: '2026 — Present', role: 'Full Stack Developer', company: 'Freelance', description: 'Building full-stack web applications with React, Django, and modern tools. Focused on clean architecture and real-world solutions.', icon: Briefcase },
  { year: '2024 — 2026', role: 'MSc Computer Science', company: 'Sree Narayana College, Cherthala — Kerala University', description: 'Specialized in software engineering, distributed systems, and machine learning. Built full-stack platforms as capstone projects.', icon: GraduationCap },
  { year: '2023 — 2024', role: 'Junior Developer', company: 'Independent Projects', description: 'Started building real-world projects — REST APIs, dashboards, and ML-powered tools. Sharpened skills in Python, JavaScript, and database design.', icon: Code2 },
  { year: '2021 — 2023', role: 'BSc Computer Science', company: 'Sree Ayyappa College, Eramallikkara, Chengannur — Kerala University', description: 'Built strong foundations in computer science, programming, data structures, and algorithms.', icon: GraduationCap },
]

const ACHIEVEMENTS = [
  { title: 'MSc Computer Science', issuer: 'Kerala University (2024-2026)', icon: GraduationCap },
  { title: 'BSc Computer Science', issuer: 'Kerala University (2021-2023)', icon: GraduationCap },
  { title: 'Full Stack Web Development', issuer: 'React, Django, Flask', icon: Code2 },
  { title: 'Machine Learning', issuer: 'Applied in Projects', icon: Brain },
  { title: 'REST API Architecture', issuer: 'Django REST Framework', icon: Server },
  { title: 'Open Source Contributor', issuer: 'GitHub @salmandev07', icon: GitBranch },
]

const TECH_MARQUEE = ['React', 'TypeScript', 'Next.js', 'Django', 'Flask', 'PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'Python', 'JavaScript', 'Tailwind', 'Node.js', 'REST APIs', 'Machine Learning', 'Git', 'Linux']

const TESTIMONIALS = [
  { quote: 'Salman delivered our project ahead of schedule with incredibly clean code. His attention to architecture is rare.', name: 'Project Collaborator', role: 'Open Source' },
  { quote: 'Rare blend of strong fundamentals and modern aesthetic sense. Anything Salman ships looks production-ready.', name: 'Peer Developer', role: 'GitHub Community' },
  { quote: 'Sharp thinker, builds fast, communicates clearly. The kind of full-stack dev every team needs.', name: 'Mentor', role: 'MSc Program' },
]

const Spotlight = () => {
  useEffect(() => {
    const handler = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return <div className="spotlight" />
}

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
}

const Particles = ({ count = 30 }) => {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    setParticles(Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, duration: Math.random() * 20 + 15, delay: Math.random() * 10,
    })))
  }, [count])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  )
}

const FloatingDots = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [dots, setDots] = useState([])
  useEffect(() => {
    setDots(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      durationX: Math.random() * 20 + 15,
      durationY: Math.random() * 20 + 15,
      delay: Math.random() * -20,
    })))
  }, [])
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: d.durationX,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const TypingText = () => {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const current = TYPING_ROLES[idx]
    const speed = deleting ? 40 : 90
    const t = setTimeout(() => {
      if (!deleting && text === current) { setTimeout(() => setDeleting(true), 1400); return }
      if (deleting && text === '') { setDeleting(false); setIdx((idx + 1) % TYPING_ROLES.length); return }
      setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1))
    }, speed)
    return () => clearTimeout(t)
  }, [text, deleting, idx])
  return <span className="cursor-blink gradient-text">{text}</span>
}

const Counter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const duration = 1600
        const start = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1)
          setCount(Math.floor(p * value))
          if (p < 1) requestAnimationFrame(tick)
        }
        tick()
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [value])
  return <span ref={ref}>{count}{suffix}</span>
}

const MagneticButton = ({ children, className = '', ...props }) => {
  const ref = useRef(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, SPRING_FAST)
  const sy = useSpring(y, SPRING_FAST)
  const handleMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25)
  }
  const handleLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.button ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={SPRING_FAST}
      style={{ x: sx, y: sy }} className={className} {...props}>{children}</motion.button>
  )
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <motion.nav initial={{ y: -20, opacity: 0, filter: 'blur(2px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} transition={SPRING}
      className={`fixed top-0 left-0 right-0 z-50 theme-transition ${
        scrolled ? 'backdrop-blur-md border-b shadow-sm' : ''
      }`}
      style={{ background: scrolled ? (isDark ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)') : 'transparent', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
      <div className="container mx-auto px-5 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <a href="#home" className="font-display font-bold text-lg text-tp">SK.</a>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-xs transition-colors duration-300 text-tm hover:text-tp">{l.label}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggle} className="p-2 rounded-full transition-colors duration-300 text-tm hover:text-tp">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a href="https://github.com/salmandev07" target="_blank" rel="noreferrer"
             className="transition-colors duration-300 text-tm hover:text-tp">
            <Github className="w-4 h-4" />
          </a>
          <a href="#contact" className="text-xs transition-colors duration-300 text-tm hover:text-tp">Contact</a>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggle} className="p-2.5 -mr-1 rounded-full text-tm">
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2.5 -mr-1.5 rounded-xl text-tm" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ ...SPRING_FAST, opacity: { duration: 0.2 } }}
            className="md:hidden border-b overflow-hidden" style={{ background: isDark ? '#141414' : '#ffffff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <div className="px-5 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="text-sm py-2.5 px-3 rounded-lg transition-colors duration-200 text-tm hover:text-tp hover:bg-black/5 dark:hover:bg-white/5">{l.label}</motion.a>
              ))}
              <div className="h-px my-2" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
              <motion.a href="https://github.com/salmandev07" target="_blank" rel="noreferrer"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.2 }}
                className="text-sm py-2.5 px-3 rounded-lg flex items-center gap-2 text-tm hover:text-tp hover:bg-black/5 dark:hover:bg-white/5">
                <Github className="w-4 h-4" /> GitHub
              </motion.a>
              <motion.a href="#contact" onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24, duration: 0.2 }}
                className="text-sm py-2.5 px-3 rounded-lg flex items-center gap-2 text-tm hover:text-tp hover:bg-black/5 dark:hover:bg-white/5">
                <Mail className="w-4 h-4" /> Contact
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

const Hero = () => {
  const { theme } = useTheme()
  const { scrollY } = useScroll()
  const isDark = theme === 'dark'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const profileY = useTransform(scrollY, [0, 600], [0, -50])

  if (isMobile) return (
    <ControlledScene isDark={isDark} />
  )

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-6 sm:pb-12">
      {/* Background ambient glow spots */}
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-80 h-48 sm:h-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-700"
        style={{ background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.1)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-56 sm:w-96 h-56 sm:h-96 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-700"
        style={{ background: isDark ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.1)' }} />
      <Particles count={20} />

      <div
        className="container mx-auto px-5 sm:px-6 relative z-10"
      >
        <div className="md:grid md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 items-center">
          <div className="space-y-5 sm:space-y-8 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for opportunities
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.25 }}
              className="font-display text-[2.5rem] sm:text-5xl md:text-[2.75rem] lg:text-7xl xl:text-[5rem] font-bold leading-[1.08] tracking-tight">
              <span className="text-tp">Hi, I&apos;m Salman.</span><br />
              <span className="text-ts">I build</span> <span className="text-tp">web</span><br />
              <span className="text-ts">experiences.</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-xl lg:text-2xl min-h-[2.5rem] h-auto flex items-center justify-center md:justify-start font-medium font-display">
              <TypingText />
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.65 }}
              className="text-sm sm:text-base max-w-md leading-relaxed mx-auto md:mx-0 text-ts">
              Full Stack Developer specializing in React, Django, and modern web technologies.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.75 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center md:justify-start">
              <MagneticButton onClick={() => scrollToTarget('#projects')}
                className="group px-6 sm:px-7 py-3 rounded-full text-sm font-medium flex items-center gap-2"
                style={{ background: isDark ? '#f0f0f0' : '#111111', color: isDark ? '#111111' : '#ffffff',
                  boxShadow: isDark ? '0 4px 14px rgba(255,255,255,0.1)' : '0 4px 14px rgba(0,0,0,0.15)' }}>
                View Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </MagneticButton>
              <MagneticButton onClick={() => scrollToTarget('#contact')}
                className="px-6 sm:px-7 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-colors duration-200 text-tp"
                style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}` }}>
                <Mail className="w-4 h-4" /> Contact
              </MagneticButton>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...SPRING, delay: 0.9 }}
              className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm pt-4 border-t justify-center md:justify-start text-tm"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Kerala, India</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> MSc Computer Science</span>
            </motion.div>
          </div>
          
          {/* Desktop/tablet image — hidden on mobile */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ y: profileY, willChange: 'transform' }}
            transition={{ ...SPRING, delay: 0.4 }}
            className="hidden md:flex items-center justify-center mt-4 md:mt-0">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ type: 'spring', stiffness: 60, damping: 30, repeat: Infinity, repeatDelay: 0.5 }}
              className="relative">
              
              <motion.div 
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
                transition={{ type: 'spring', stiffness: 50, damping: 25, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute -inset-4 md:-inset-6 lg:-inset-10 rounded-full pointer-events-none"
                style={{ background: isDark ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)', filter: 'blur(40px)' }} />

              <div className="relative p-[3px] rounded-[1.25rem] lg:rounded-[2rem]" style={{ background: isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 100%)' }}>
                <div className="relative overflow-hidden rounded-[1.15rem] lg:rounded-[1.85rem]" style={{ background: isDark ? '#141414' : '#F2F2F2' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/salman_profile.png" alt="Salman Khan"
                    className="w-52 h-52 md:w-64 md:h-64 lg:w-[26rem] lg:h-[26rem] object-cover hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.85 }}
                className="absolute -left-1.5 md:-left-3 lg:-left-6 bottom-3 md:bottom-6 lg:bottom-12 z-20">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 sm:gap-2.5 md:gap-3" style={{ background: isDark ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)' }}>
                    <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider font-semibold text-tm">Stack</div>
                    <div className="text-[10px] sm:text-xs md:text-sm font-bold text-tp">React & Django</div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.95 }}
                className="absolute -right-1.5 md:-right-3 lg:-right-6 top-3 md:top-6 lg:top-12 z-20">
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="px-2 sm:px-2.5 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center gap-1.5 sm:gap-2 md:gap-2.5" style={{ background: isDark ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-md lg:rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)' }}>
                    <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider font-semibold text-tm">Specialty</div>
                    <div className="text-[10px] sm:text-[11px] md:text-xs font-bold text-tp">Clean Code</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const ControlledScene = ({ isDark }) => {
  const [intercepting, setIntercepting] = useState(true)
  const overlayRef = useRef(null)
  const totalRef = useRef(0)
  const lastY = useRef(null)
  const lockedRef = useRef(true)
  const rawProgress = useMotionValue(0)
  const scrollTo = (sel) => window.__portfolioLenis?.scrollTo(sel, { offset: -20 })

  const SENSITIVITY = 300
  const WHEEL_FACTOR = 0.002

  const smooth = useSpring(rawProgress, { stiffness: 80, damping: 22, mass: 0.6 })

  const imgOpacity = useTransform(smooth, [0, 1], [1, 0])
  const imgY = useTransform(smooth, [0.25, 0.60], [0, 180])
  const imgScale = useTransform(smooth, [0.25, 0.60], [1, 0.82])
  const imgBlur = useTransform(smooth, [0.25, 0.60], [0, 30])
  const imgFilter = useMotionTemplate`blur(${imgBlur}px)`

  const badgeOpacity = useTransform(smooth, [0.40, 0.55], [0, 1])
  const badgeY = useTransform(smooth, [0.40, 0.55], [40, 0])

  const headingOpacity = useTransform(smooth, [0.45, 0.75], [0, 1])
  const headingY = useTransform(smooth, [0.45, 0.75], [80, 0])
  const headingBlurVal = useTransform(smooth, [0.45, 0.75], [18, 0])
  const headingBlur = useMotionTemplate`blur(${headingBlurVal}px)`

  const typingOpacity = useTransform(smooth, [0.55, 0.82], [0, 1])
  const typingY = useTransform(smooth, [0.55, 0.82], [30, 0])

  const buttonsOpacity = useTransform(smooth, [0.65, 0.90], [0, 1])
  const buttonsY = useTransform(smooth, [0.65, 0.90], [25, 0])

  const footerOpacity = useTransform(smooth, [0.72, 0.90], [0, 1])

  const scrollHintOpacity = useTransform(smooth, [0, 0.15, 0.30], [1, 0.5, 0])

  useEffect(() => {
  if (intercepting) {
    window.__portfolioLenis?.stop()
  } else {
    window.__portfolioLenis?.start()
  }

  return () => {
    window.__portfolioLenis?.start()
  }
}, [intercepting])


  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    const onWheel = (e) => {
      if (!lockedRef.current) return
      if (e.deltaY <= 0) return
      const next = Math.min(1, totalRef.current + e.deltaY * WHEEL_FACTOR)
      totalRef.current = next
      rawProgress.set(next)
      e.preventDefault()
      if (next >= 1) {
        lockedRef.current = false
        setIntercepting(false)
      }
    }

    const onTouchMove = (e) => {
      if (!lockedRef.current) return
      const y = e.touches[0].clientY
      if (lastY.current === null) { lastY.current = y; return }
      const delta = lastY.current - y
      lastY.current = y
      if (delta <= 0) return
      const next = Math.min(1, totalRef.current + delta / SENSITIVITY)
      totalRef.current = next
      rawProgress.set(next)
      e.preventDefault()
      if (next >= 1) {
        lockedRef.current = false
        setIntercepting(false)
      }
    }

    const onTouchStart = (e) => {
      lastY.current = null
      if (lockedRef.current) e.preventDefault()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchstart', onTouchStart)
    }
  }, [intercepting, rawProgress])

  useEffect(() => {
    const reset = () => {
      if (window.scrollY <= 20 && !lockedRef.current) {
        lockedRef.current = true
        totalRef.current = 0
        rawProgress.set(0)
        setIntercepting(true)
      }
    }
    window.addEventListener('scroll', reset, { passive: true })
    return () => window.removeEventListener('scroll', reset)
  }, [rawProgress])

  useEffect(() => {
    return () => { lockedRef.current = false }
  }, [])

  return (
    <>
      <section id="home" style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden',
        background: isDark ? '#0a0a0a' : '#ffffff' }}>

        {/* Background ambient glow */}
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '12rem', height: '12rem', borderRadius: '9999px', filter: 'blur(72px)', pointerEvents: 'none', zIndex: 0,
          background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.1)' }} />
        <div style={{ position: 'absolute', bottom: '33%', right: '25%', width: '14rem', height: '14rem', borderRadius: '9999px', filter: 'blur(72px)', pointerEvents: 'none', zIndex: 0,
          background: isDark ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.1)' }} />

        {/* Text layer (z-index: 1) */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 1 }}>
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '24rem' }}>
            <motion.div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, marginBottom: '1.25rem',
              background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981', opacity: badgeOpacity, y: badgeY }}>
              <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '9999px', background: '#10b981', animation: 'pulse 2s infinite' }} />
              Available for opportunities
            </motion.div>

            <motion.h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: '1rem',
              opacity: headingOpacity, y: headingY, filter: headingBlur }}>
              <span style={{ color: 'var(--tp)' }}>Hi, I&apos;m Salman.</span><br />
              <span style={{ color: 'var(--ts)' }}>I build</span> <span style={{ color: 'var(--tp)' }}>web</span><br />
              <span style={{ color: 'var(--ts)' }}>experiences.</span>
            </motion.h1>

            <motion.div style={{ fontSize: '1.125rem', minHeight: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontFamily: 'var(--font-display)', marginBottom: '1rem',
              opacity: typingOpacity, y: typingY }}>
              <TypingText />
            </motion.div>

            <motion.div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.25rem',
              opacity: buttonsOpacity, y: buttonsY }}>
              <MagneticButton onClick={() => scrollTo('#projects')}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: isDark ? '#f0f0f0' : '#111111', color: isDark ? '#111111' : '#ffffff',
                  boxShadow: isDark ? '0 4px 14px rgba(255,255,255,0.1)' : '0 4px 14px rgba(0,0,0,0.15)' }}>
                View Work <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </MagneticButton>
              <MagneticButton onClick={() => scrollTo('#contact')}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, color: 'var(--tp)' }}>
                <Mail style={{ width: '1rem', height: '1rem' }} /> Contact
              </MagneticButton>
            </motion.div>

            <motion.div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', paddingTop: '1rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, justifyContent: 'center', color: 'var(--tm)',
              opacity: footerOpacity }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><MapPin style={{ width: '0.875rem', height: '0.875rem' }} /> Kerala, India</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><GraduationCap style={{ width: '0.875rem', height: '0.875rem' }} /> MSc Computer Science</span>
            </motion.div>

            {/* Scroll hint */}
            <motion.div style={{ marginTop: '2rem', opacity: scrollHintOpacity, fontSize: '0.75rem', color: 'var(--tm)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span>scroll</span>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <ChevronDown style={{ width: '1rem', height: '1rem' }} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image layer (z-index: 2) */}
        <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, pointerEvents: 'none', opacity: imgOpacity, scale: imgScale, y: imgY, filter: imgFilter }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-3rem', borderRadius: '9999px', pointerEvents: 'none',
              background: isDark ? 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', padding: '2px', borderRadius: '1rem',
              background: isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 100%)' }}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.85rem', background: isDark ? '#141414' : '#F2F2F2' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/salman_profile.png" alt="Salman Khan" style={{ width: 'min(80vw, 20rem)', height: 'min(80vw, 20rem)', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.05), transparent, transparent)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Floating cards (z-index: 20) */}
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', left: '-1rem', bottom: '1.5rem', zIndex: 20 }}>
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: isDark ? 'rgba(20,20,20,0.92)' : 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)' }}>
                  <Code2 style={{ width: '0.875rem', height: '0.875rem', color: '#10b981' }} />
                </div>
                <div>
                  <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--tm)' }}>Stack</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--tp)' }}>React & Django</div>
                </div>
              </div>
            </motion.div>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              style={{ position: 'absolute', right: '-0.75rem', top: '2rem', zIndex: 20 }}>
              <div style={{ padding: '0.375rem 0.625rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem',
                background: isDark ? 'rgba(20,20,20,0.92)' : 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)' }}>
                  <Brain style={{ width: '0.625rem', height: '0.625rem', color: '#10b981' }} />
                </div>
                <div>
                  <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--tm)' }}>Specialty</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--tp)' }}>Clean Code</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </section>

      {/* Touch interceptor — fixed overlay, removed after animation */}
      {intercepting && (
  <div
    ref={overlayRef}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      pointerEvents: "auto",
      touchAction: "none",
      userSelect: "none",
    }}
  />
)}
    </>
  )
}

const Section = ({ id, eyebrow, title, subtitle, children, className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sectionYRaw = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, -12])
  const sectionY = useSpring(sectionYRaw, SCROLL_SPRING)

  return (
    <section ref={ref} id={id} className={`relative py-16 sm:py-24 md:py-32 px-5 sm:px-6 ${className}`}>
      <motion.div style={{ y: sectionY }} className="container mx-auto max-w-6xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 28, filter: 'blur(2px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }} transition={SPRING}
          className="mb-12 sm:mb-16 md:mb-20">
        {eyebrow && (
          <motion.div initial={{ opacity: 0, y: 15, filter: 'blur(2px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }} transition={SPRING}
            className="text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 text-tm">
            {eyebrow}
          </motion.div>
        )}
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">{title}</h2>
        {subtitle && <motion.p initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: 0.15 }} className="text-sm sm:text-base mt-3 sm:mt-4 max-w-lg text-ts">{subtitle}</motion.p>}
      </motion.div>
      {children}
    </motion.div>
  </section>
  )
}

const About = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <Section id="about" eyebrow="About" title={<>The story <span className="text-tm">behind the code</span></>}>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-12">
      {STATS.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 26, filter: 'blur(3px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.06 }} whileHover={{ y: -6, scale: 1.02 }}
          className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-3.5 sm:p-6 text-center">
          <div className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-0.5 sm:mb-1">
            <Counter value={s.value} suffix={s.suffix} />
          </div>
          <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-tm">{s.label}</div>
        </motion.div>
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
      <motion.div initial={{ opacity: 0, x: -24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }}
        transition={SPRING} whileHover={{ y: -6, scale: 1.02 }} className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-ts" />
          </div>
          <h3 className="font-display text-base sm:text-xl font-bold">My Journey</h3>
        </div>
        <p className="leading-relaxed mb-3 sm:mb-4 text-sm text-ts">
          I&apos;m Salman Khan — a Full Stack Developer with an MSc in Computer Science from Sree Narayana College, Cherthala, Kerala University.
        </p>
        <p className="leading-relaxed text-sm text-ts">
          From full-stack platforms to ML-powered tools, I build software that feels effortless to use. BSc in Computer Science from Sree Ayyappa College, Chengannur.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: 0.08 }} whileHover={{ y: -6, scale: 1.02 }} className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-ts" />
          </div>
          <h3 className="font-display text-base sm:text-xl font-bold">What I Value</h3>
        </div>
        <ul className="space-y-2.5 sm:space-y-4 text-sm">
          {[
            ['Quality over quantity', 'Code that reads like prose.'],
            ['Performance matters', 'Every millisecond counts.'],
            ['Design + Engineering', 'Beauty and function must coexist.'],
            ['Continuous learning', 'Today\'s best practice is tomorrow\'s legacy.'],
          ].map(([k, v]) => (
            <li key={k} className="flex gap-2.5 sm:gap-3">
              <div className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-tm" />
              <div className="text-ts"><span className="font-medium text-tp">{k}.</span> {v}</div>
            </li>
          ))}
        </ul>
      </motion.div>
      </div>
    </Section>
  )
}

const Skills = () => {
  const [active, setActive] = useState('Frontend')
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const categories = Object.keys(SKILLS)
  return (
    <Section id="skills" eyebrow="Skills" title={<>Tech I <span className="text-tm">work with</span></>}>
      <div className="flex overflow-x-auto gap-2 mb-8 sm:mb-10 pb-2 -mx-1 px-1 hide-scrollbar">
        {categories.map((c) => {
          const Icon = SKILL_ICONS[c]
          const isActive = active === c
          return (
            <motion.button key={c} onClick={() => setActive(c)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              animate={isActive ? { y: -1 } : { y: 0 }}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-medium flex-shrink-0 whitespace-nowrap"
              style={{
                background: isActive
                  ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)')
                  : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'),
                color: isActive
                  ? (isDark ? '#f0f0f0' : '#111111')
                  : (isDark ? '#555555' : '#888888'),
                border: `1px solid ${isActive ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)') : 'transparent'}`,
                boxShadow: isActive
                  ? isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)'
                  : 'none',
              }}>
              <Icon className="w-3.5 h-3.5" />{c}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(2px)' }}
          transition={SPRING_FAST}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {SKILLS[active].map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 28, scale: 0.95, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ ...SPRING, delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-strong glass-interactive rounded-xl p-3.5 sm:p-5">
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <span className="text-sm font-medium text-tp">{s.name}</span>
                <span className="font-mono text-[10px] text-tm">{s.level}%</span>
              </div>
              <div className="h-1.5 glass rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.level}%` }}
                  transition={{ ...SPRING, delay: 0.16 + i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ background: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(17,17,17,0.35)' }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  )
}

const ProjectCard = ({ p, idx }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgYRaw = useTransform(scrollYProgress, [0, 1], [24, -24])
  const imgY = useSpring(imgYRaw, SCROLL_SPRING)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <div ref={ref} className="group relative">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(2px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: idx * 0.08 }}
        whileHover={{ y: -6, scale: 1.02 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl glass-strong border border-white/[0.08]"
        style={{ boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.06)' }}>
        
        {/* Image area */}
        <div className="relative h-48 sm:h-72 lg:h-80 overflow-hidden">
          <motion.div style={{ y: imgY, scale: 1.15 }} className="absolute inset-0 parallax-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name}
              className="w-full h-full object-cover" />
          </motion.div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          {/* Project number badge */}
          <div className="absolute top-3.5 sm:top-5 left-3.5 sm:left-5 w-7 h-7 sm:w-9 sm:h-9 rounded-full glass flex items-center justify-center">
            <span className="text-[9px] sm:text-xs font-bold text-white/90">{String(idx + 1).padStart(2, '0')}</span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1 sm:mb-2">{p.tagline}</div>
            <h3 className="font-display text-xl sm:text-3xl md:text-4xl font-bold text-white">{p.name}</h3>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-5">
          <p className="text-sm sm:text-[15px] leading-relaxed text-ts max-w-2xl">{p.description}</p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {p.tech.map((t) => (
              <span key={t} className="px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-medium glass rounded-full text-tm">{t}</span>
            ))}
          </div>

          {/* Metrics row */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {p.metrics.map((m) => (
              <div key={m.v} className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-display font-bold text-xs sm:text-base text-tp">{m.k}</span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-tm">{m.v}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

          {/* Links */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <motion.a href={p.github} target="_blank" rel="noreferrer"
               whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={SPRING_FAST}
               className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 glass rounded-full text-[11px] sm:text-xs font-medium text-tp">
              <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Source Code <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-50" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const Projects = () => (
  <Section id="projects" eyebrow="Projects" title={<>Selected <span className="text-tm">work</span></>}>
    <div className="space-y-6 sm:space-y-8">
      {PROJECTS.map((p, i) => <ProjectCard key={p.name} p={p} idx={i} />)}
    </div>
  </Section>
)

const Experience = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  })
  const timelineScale = useSpring(scrollYProgress, SCROLL_SPRING)
  return (
    <Section id="experience" eyebrow="Experience" title={<>Professional <span className="text-tm">timeline</span></>}>
      <div ref={containerRef} className="relative ml-2 sm:ml-4 space-y-6 sm:space-y-12">
        {/* Vertical timeline track line */}
        <div className="absolute left-3.5 sm:left-6 top-2 bottom-2 w-[2px] bg-black/10 dark:bg-white/10 rounded-full" />
        
        {/* Glowing active drawing line */}
        <motion.div 
          className="absolute left-3.5 sm:left-6 top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full origin-top"
          style={{ scaleY: timelineScale }}
        />
        
        {EXPERIENCE.map((e, i) => {
          const Icon = e.icon
          return (
            <div key={e.year} className="relative group">
              {/* Timeline dot/icon indicator */}
              <motion.div className="absolute left-3.5 sm:left-6 top-8 sm:top-10 -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full glass-strong border border-black/10 dark:border-white/10 flex items-center justify-center z-10" whileHover={{ scale: 1.1 }} transition={SPRING_FAST}>
                <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-500" />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.08 }} whileHover={{ y: -6, scale: 1.02 }}
                className="ml-9 sm:ml-16 glass-strong glass-interactive rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] sm:text-xs font-mono mb-0.5 sm:mb-1 text-tm">{e.year}</div>
                  <h3 className="font-display font-bold text-sm sm:text-lg mb-0.5 sm:mb-1">{e.role}</h3>
                  <div className="text-[11px] sm:text-sm mb-1.5 sm:mb-3 text-tm">{e.company}</div>
                  <p className="text-xs sm:text-sm leading-relaxed text-ts">{e.description}</p>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

const Achievements = () => (
  <Section id="achievements" eyebrow="Achievements" title={<>Milestones <span className="text-tm">along the way</span></>}>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
      {ACHIEVEMENTS.map((a, i) => {
        const Icon = a.icon
        return (
          <motion.div key={a.title} initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.06 }} whileHover={{ y: -6, scale: 1.02 }}
            className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 group">
            <motion.div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl glass flex items-center justify-center mb-2.5 sm:mb-4" whileHover={{ scale: 1.05 }} transition={SPRING_FAST}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-ts" />
            </motion.div>
            <h3 className="font-display font-bold text-sm sm:text-base mb-0.5 sm:mb-1">{a.title}</h3>
            <p className="text-[9px] sm:text-xs text-tm">{a.issuer}</p>
          </motion.div>
        )
      })}
    </div>
  </Section>
)

const TechMarquee = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <section className="py-12 sm:py-20 overflow-hidden border-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
      <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(3px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }}
        transition={SPRING}
        className="text-center mb-5 sm:mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-tm">Tech Stack</div>
      </motion.div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r to-transparent z-10 pointer-events-none" style={{ ['--tw-gradient-from']: isDark ? '#0a0a0a' : '#F2F2F2' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l to-transparent z-10 pointer-events-none" style={{ ['--tw-gradient-from']: isDark ? '#0a0a0a' : '#F2F2F2' }} />
        <div className="flex marquee gap-5 sm:gap-8 w-max">
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((t, i) => (
            <div key={i} className="px-3.5 sm:px-6 py-2 sm:py-3 text-[11px] sm:text-sm whitespace-nowrap glass rounded-full text-tm">
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const COLORS = {
  light: { NONE: '#ebedf0', FIRST_QUARTILE: '#9be9a8', SECOND_QUARTILE: '#40c463', THIRD_QUARTILE: '#30a14e', FOURTH_QUARTILE: '#216e39' },
  dark: { NONE: '#161b22', FIRST_QUARTILE: '#0e4429', SECOND_QUARTILE: '#006d32', THIRD_QUARTILE: '#26a641', FOURTH_QUARTILE: '#39d353' },
}

const CELL = 9
const GAP = 2
const LABEL_WIDTH = 28
const MOBILE_WEEKS = 24

const ContributionGridDesktop = memo(({ weeks, total, isDark }) => {
  const palette = isDark ? COLORS.dark : COLORS.light

  const monthLabels = useMemo(() => {
    return weeks.map((week, i) => {
      const d = new Date(week.contributionDays[0].date + 'T00:00:00')
      if (i === 0 || d.getDate() <= 7) {
        return d.toLocaleString('default', { month: 'short' })
      }
      return ''
    })
  }, [weeks])

  return (
    <>
      <div style={{ display: 'flex', gap: 0, marginBottom: 4, height: 14, paddingLeft: LABEL_WIDTH }}>
        {monthLabels.map((label, i) => (
          <div key={i} style={{ width: CELL + GAP, flexShrink: 0, position: 'relative' }}>
            {label && (
              <span style={{ position: 'absolute', left: 0, top: 0, fontSize: 10, color: isDark ? '#8b949e' : '#656d76', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', width: 'fit-content', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4, paddingTop: 1 }}>
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
            <span key={i} style={{ width: LABEL_WIDTH, height: CELL, fontSize: 10, lineHeight: `${CELL}px`, color: isDark ? '#8b949e' : '#656d76', textAlign: 'right' }}>
              {label}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: GAP, flexShrink: 0 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP, flexShrink: 0 }}>
              {week.contributionDays.map((day, di) => (
                <div
                  key={di}
                  title={day.contributionCount ? `${day.contributionCount} contributions` : 'No contributions'}
                  style={{
                    width: CELL, height: CELL, flexShrink: 0, borderRadius: 2,
                    backgroundColor: palette[day.contributionLevel],
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 4 }}>
        <span style={{ fontSize: 11, color: isDark ? '#8b949e' : '#656d76' }}>
          {total.toLocaleString()} contributions in the last year
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: isDark ? '#8b949e' : '#656d76' }}>Less</span>
          {Object.values(palette).map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c }} />
          ))}
          <span style={{ fontSize: 10, color: isDark ? '#8b949e' : '#656d76' }}>More</span>
        </div>
      </div>
    </>
  )
})
ContributionGridDesktop.displayName = 'ContributionGridDesktop'

const ContributionGridMobile = memo(({ weeks, total, isDark }) => {
  const palette = isDark ? COLORS.dark : COLORS.light
  const recentWeeks = useMemo(() => weeks.slice(-MOBILE_WEEKS), [weeks])

  return (
    <>
      <div style={{ display: 'flex', gap: GAP, flexShrink: 0 }}>
        {recentWeeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP, flexShrink: 0 }}>
            {week.contributionDays.map((day, di) => (
              <div
                key={di}
                title={day.contributionCount ? `${day.contributionCount} contributions` : 'No contributions'}
                style={{
                  width: CELL, height: CELL, flexShrink: 0, borderRadius: 2,
                  backgroundColor: palette[day.contributionLevel],
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 4 }}>
        <span style={{ fontSize: 10, color: isDark ? '#8b949e' : '#656d76' }}>
          {total.toLocaleString()} contributions in the last year
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 9, color: isDark ? '#8b949e' : '#656d76' }}>Less</span>
          {Object.values(palette).map((c) => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: c }} />
          ))}
          <span style={{ fontSize: 9, color: isDark ? '#8b949e' : '#656d76' }}>More</span>
        </div>
      </div>
    </>
  )
})
ContributionGridMobile.displayName = 'ContributionGridMobile'

const ContributionGrid = memo(({ weeks, total, isDark }) => {
  if (!weeks || !weeks.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...SPRING, delay: 0.1 }}
    >
      <div className="sm:hidden overflow-x-auto hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <ContributionGridMobile weeks={weeks} total={total} isDark={isDark} />
      </div>

      <div className="hidden sm:block overflow-x-auto hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: LABEL_WIDTH + weeks.length * (CELL + GAP) }}>
          <ContributionGridDesktop weeks={weeks} total={total} isDark={isDark} />
        </div>
      </div>
    </motion.div>
  )
})
ContributionGrid.displayName = 'ContributionGrid'

const GitHubSection = memo(() => {
  const [repos, setRepos] = useState([])
  const [repoCount, setRepoCount] = useState(0)
  const [followers, setFollowers] = useState(0)
  const [languages, setLanguages] = useState([])
  const [contribWeeks, setContribWeeks] = useState(null)
  const [contribTotal, setContribTotal] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    fetch('https://api.github.com/users/salmandev07')
      .then(r => r.json())
      .then(data => {
        if (data.public_repos !== undefined) {
          setRepoCount(data.public_repos)
          setFollowers(data.followers || 0)
        }
      })
      .catch(() => {})

    fetch('https://api.github.com/users/salmandev07/repos?per_page=100&sort=updated')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data)
          const langs = [...new Set(data.map(r => r.language).filter(Boolean))]
          setLanguages(langs)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/github/contributions')
      .then(r => r.json())
      .then(data => {
        if (data.weeks && data.weeks.length > 0) {
          setContribWeeks(data.weeks)
          setContribTotal(data.total)
        }
      })
      .catch(() => {})
  }, [])

  const statCards = useMemo(() => [
    { k: 'Public Repos', v: repoCount || '...', icon: GitBranch },
    { k: 'Followers', v: followers || '...', icon: Heart },
    { k: 'Languages', v: languages.length ? languages.join(', ') : '...', icon: Terminal },
  ], [repoCount, followers, languages])

  return (
    <Section id="github" eyebrow="GitHub" title={<>Open source <span className="text-tm">activity</span></>} className="github-section">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={SPRING}
          className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:col-span-2"
          style={{ willChange: 'transform, opacity', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <div className="w-full">
            {contribWeeks ? (
              <ContributionGrid weeks={contribWeeks} total={contribTotal} isDark={isDark} />
            ) : (
              <div className="w-full h-[110px] rounded-lg animate-pulse" style={{ backgroundColor: isDark ? '#161b22' : '#ebedf0' }} />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.24 }}
            className="mt-3 sm:mt-5 flex items-center justify-between"
          >
            <div>
              <div className="font-display text-lg sm:text-xl font-bold">@salmandev07</div>
              <div className="text-[10px] sm:text-xs text-tm">Contribution graph</div>
            </div>
            <a href="https://github.com/salmandev07" target="_blank" rel="noreferrer"
               className="text-[10px] sm:text-xs transition flex items-center gap-1 text-tm hover:text-tp"
               style={{ transition: 'color 0.2s ease, transform 0.2s ease' }}>
              View Profile <ArrowUpRight className="w-3 h-3" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...SPRING, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4"
        >
          {statCards.map((s, i) => {
            const Icon = s.icon
            const isLangCard = s.k === 'Languages'
            return (
              <div
                key={s.k}
                className={`glass-strong glass-interactive rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 ${isLangCard ? 'col-span-2 lg:col-span-1' : ''}`}
                style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1.5 sm:mb-3 text-tm" />
                <div className="font-display text-sm sm:text-base lg:text-lg font-bold">{s.v}</div>
                <div className="text-[8px] sm:text-[10px] lg:text-xs text-tm">{s.k}</div>
              </div>
            )
          })}
        </motion.div>

        {repos.length > 0 && (
          <motion.div className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 px-1 text-tm">
              Recent Repositories
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {repos.slice(0, 6).map((r, i) => (
                <a
                  key={r.id}
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-3.5 sm:p-5 group block"
                  style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="font-display font-bold text-[11px] sm:text-sm truncate">{r.name}</span>
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 text-tm group-hover:text-tp" />
                  </div>
                  <p className="text-[9px] sm:text-xs line-clamp-2 mb-1.5 sm:mb-2 text-tm">{r.description || 'No description'}</p>
                  <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] text-tm">
                    {r.language && <span>{r.language}</span>}
                    {r.stargazers_count > 0 && <span>★ {r.stargazers_count}</span>}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  )
})
GitHubSection.displayName = 'GitHubSection'

const Testimonials = () => {
  const [idx, setIdx] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <Section id="testimonials" eyebrow="Testimonials" title={<>What people <span className="text-tm">say</span></>}>
      <div className="max-w-2xl">
        <div className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 relative min-h-[200px] sm:min-h-[260px]">
          <div className="text-3xl sm:text-4xl absolute top-4 sm:top-6 left-4 sm:left-6 text-tm">&ldquo;</div>
          <div className="relative h-36 sm:h-48 pt-5 sm:pt-8">
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, y: 18, filter: 'blur(2px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(2px)' }} transition={SPRING_FAST}
                className="absolute inset-0">
                <p className="text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6 text-ts">{TESTIMONIALS[idx].quote}&rdquo;</p>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full glass flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    {TESTIMONIALS[idx].name[0]}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium">{TESTIMONIALS[idx].name}</div>
                    <div className="text-[10px] sm:text-xs text-tm">{TESTIMONIALS[idx].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          {TESTIMONIALS.map((_, i) => (
            <motion.button key={i} onClick={() => setIdx(i)}
              animate={{ width: idx === i ? '1.75rem' : '0.75rem', background: idx === i ? (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-1 rounded-full" />
          ))}
        </div>
      </div>
    </Section>
  )
}

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Message sent! I\u2019ll get back to you soon.')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Something went wrong. Try emailing me directly.')
    } finally { setLoading(false) }
  }
  return (
    <Section id="contact" eyebrow="Contact" title={<>Let&apos;s <span className="text-tm">connect</span></>}>
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-6 max-w-5xl">
        <div className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 space-y-3 sm:space-y-6">
          {[
            { icon: Mail, k: 'Email', v: 'salmandevxofficial@gmail.com', href: 'mailto:salmandevxofficial@gmail.com' },
            { icon: Github, k: 'GitHub', v: '@salmandev07', href: 'https://github.com/salmandev07' },
            { icon: Linkedin, k: 'LinkedIn', v: 'salman-khan', href: 'https://linkedin.com/in/salman-khan-944186412' },
            { icon: MapPin, k: 'Location', v: 'Kerala, India', href: '#' },
          ].map((c, i) => {
            const Icon = c.icon
            return (
              <motion.a key={c.k} href={c.href} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, x: -25, filter: 'blur(2px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.06 }} whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-center gap-2.5 sm:gap-4 glass glass-interactive rounded-xl p-2.5 sm:p-4 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-tm">{c.k}</div>
                  <div className="text-[11px] sm:text-sm truncate">{c.v}</div>
                </div>
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 text-tm" />
              </motion.a>
            )
          })}
        </div>
        <motion.form onSubmit={submit} initial={{ opacity: 0, x: 25, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }} transition={SPRING}
          className="glass-strong rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 space-y-3.5 sm:space-y-5">
          <div>
            <label className="text-[8px] sm:text-[10px] uppercase tracking-widest mb-1.5 sm:mb-2 block text-tm">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass border-0 h-9 sm:h-11 rounded-xl text-sm focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Your name" />
          </div>
          <div>
            <label className="text-[8px] sm:text-[10px] uppercase tracking-widest mb-1.5 sm:mb-2 block text-tm">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="glass border-0 h-9 sm:h-11 rounded-xl text-sm focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-[8px] sm:text-[10px] uppercase tracking-widest mb-1.5 sm:mb-2 block text-tm">Message</label>
            <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="glass border-0 rounded-xl text-sm focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Tell me about your project..." />
          </div>
          <motion.button disabled={loading} type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={SPRING_FAST}
            className="w-full px-6 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition disabled:opacity-50 shadow-md"
            style={{ background: isDark ? '#f0f0f0' : '#111111', color: isDark ? '#111111' : '#ffffff' }}>
            {loading ? 'Sending...' : 'Send Message'}
          </motion.button>
        </motion.form>
      </div>
    </Section>
  )
}

const Footer = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }} className="py-8 sm:py-12 px-5 sm:px-6 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
    <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
      <div className="text-[11px] sm:text-sm text-tm">© {new Date().getFullYear()} Salman Khan</div>
      <div className="flex items-center gap-2 sm:gap-3">
        {[
          { icon: Github, href: 'https://github.com/salmandev07' },
          { icon: Linkedin, href: 'https://linkedin.com/in/salman-khan-944186412' },
          { icon: Mail, href: 'mailto:salmandevxofficial@gmail.com' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
              <motion.a key={i} href={s.href} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.06 }} whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="w-8 h-8 sm:w-9 sm:h-9 glass rounded-full flex items-center justify-center hover:shadow-md text-tm">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.a>
          )
        })}
      </div>
    </div>
  </motion.footer>
  )
}

const BackToTop = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const f = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }} transition={SPRING_FAST} whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.98 }}
          onClick={() => scrollToTarget(0)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 glass-strong rounded-full flex items-center justify-center shadow-lg hover:shadow-xl gpu-accel text-tp"
          aria-label="Back to top">
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

const LoadingScreen = ({ done }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <AnimatePresence>
      {!done && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING_FAST}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: isDark ? '#0a0a0a' : '#F2F2F2' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={SPRING_FAST}
            className="font-display text-2xl font-bold tracking-tight text-tp">SK.</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const App = () => {
  const [loaded, setLoaded] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => 1 - Math.pow(2, -10 * t),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: false,
    })
    window.__portfolioLenis = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (window.__portfolioLenis === lenis) delete window.__portfolioLenis
    }
  }, [shouldReduceMotion])

  return (
    <ThemeProvider>
      <main className="relative min-h-screen overflow-x-hidden">
        <ScrollProgress />
        <Spotlight />
        <FloatingDots />
        <LoadingScreen done={loaded} />
        <Toaster position="top-center" richColors theme="dark" />
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <TechMarquee />
        <GitHubSection />
        <Testimonials />
        <Contact />
        <Footer />
        <BackToTop />
      </main>
    </ThemeProvider>
  )
}

export default App
