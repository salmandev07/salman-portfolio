'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, ArrowRight, ArrowUpRight, Code2, Database, Cloud, Wrench, GraduationCap, Briefcase, Menu, X, Rocket, GitBranch, Brain, ArrowUp, Terminal, Heart, Server, Sun, Moon } from 'lucide-react'
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
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
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
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={toggle} className="p-2 rounded-full text-tm">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className="text-tm">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0, filter: 'blur(2px)' }} animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }} exit={{ opacity: 0, height: 0, filter: 'blur(2px)' }}
            transition={SPRING_FAST}
            className="md:hidden border-b overflow-hidden" style={{ background: isDark ? '#141414' : '#ffffff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm transition-colors duration-300 text-tm">{l.label}</a>
              ))}
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
  const textYRaw = useTransform(scrollY, [0, 600], [0, 80])
  const opacityRaw = useTransform(scrollY, [0, 400], [1, 0])
  const profileTransformRaw = useTransform(scrollY, [0, 600], [0, -50])

  const textY = textYRaw
  const textOpacity = opacityRaw
  const profileY = profileTransformRaw
  const isDark = theme === 'dark'
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-8 sm:pb-12">
      {/* Background ambient glow spots */}
      <div className="absolute top-1/4 left-1/4 w-60 sm:w-80 h-60 sm:h-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-700"
        style={{ background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.1)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-700"
        style={{ background: isDark ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.1)' }} />
      <Particles count={20} />

      <motion.div style={{ y: textY, opacity: textOpacity, willChange: "transform, opacity" }} className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for opportunities
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.25 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-bold leading-[1.1] tracking-tight">
              <span className="text-tp">Hi, I&apos;m Salman.</span><br />
              <span className="text-ts">I build</span> <span className="text-tp">web</span><br />
              <span className="text-ts">experiences.</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl min-h-[2.5rem] h-auto flex items-center justify-center lg:justify-start font-medium font-display">
              <TypingText />
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.65 }}
              className="text-sm sm:text-base max-w-md leading-relaxed mx-auto lg:mx-0 text-ts">
              Full Stack Developer specializing in React, Django, and modern web technologies.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.75 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <MagneticButton onClick={() => scrollToTarget('#projects')}
                className="group px-6 sm:px-7 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300"
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
              className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm pt-4 border-t justify-center lg:justify-start text-tm"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Kerala, India</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> MSc Computer Science</span>
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ y: profileY, willChange: "transform" }}
            transition={{ ...SPRING, delay: 0.4 }}
            className="flex items-center justify-center mt-8 lg:mt-0">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ type: 'spring', stiffness: 60, damping: 30, repeat: Infinity, repeatDelay: 0.5 }}
              className="relative">
              
              {/* Ambient glow behind image */}
              <motion.div 
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
                transition={{ type: 'spring', stiffness: 50, damping: 25, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute -inset-8 sm:-inset-10 rounded-full pointer-events-none"
                style={{ background: isDark ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)', filter: 'blur(40px)' }} />

              {/* Outer glass container */}
              <div className="relative p-[3px] rounded-[1.5rem] sm:rounded-[2rem]" style={{ background: isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 100%)' }}>
                <div className="relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.85rem]" style={{ background: isDark ? '#141414' : '#F2F2F2' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/salman_profile.png" alt="Salman Khan"
                    className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem] object-cover hover:scale-[1.03] transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating tech badge */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.85 }}
                className="absolute -left-3 sm:-left-6 bottom-8 sm:bottom-12 z-20">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3" style={{ background: isDark ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)' }}>
                    <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-tm">Stack</div>
                    <div className="text-xs sm:text-sm font-bold text-tp">React & Django</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating specialty badge */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.95 }}
                className="absolute -right-3 sm:-right-6 top-8 sm:top-12 z-20">
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-2.5" style={{ background: isDark ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)' }}>
                    <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-tm">Specialty</div>
                    <div className="text-[11px] sm:text-xs font-bold text-tp">Clean Code</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

const Section = ({ id, eyebrow, title, subtitle, children, className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sectionYRaw = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, -12])
  const sectionY = useSpring(sectionYRaw, SCROLL_SPRING)

  return (
    <section ref={ref} id={id} className={`relative py-20 sm:py-32 px-4 sm:px-6 ${className}`}>
      <motion.div style={{ y: sectionY }} className="container mx-auto max-w-6xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 28, filter: 'blur(2px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }} transition={SPRING}
          className="mb-16 sm:mb-20">
        {eyebrow && (
          <motion.div initial={{ opacity: 0, y: 15, filter: 'blur(2px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }} transition={SPRING}
            className="text-xs uppercase tracking-[0.2em] mb-4 text-tm">
            {eyebrow}
          </motion.div>
        )}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">{title}</h2>
        {subtitle && <motion.p initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: 0.15 }} className="text-sm sm:text-base mt-4 max-w-lg text-ts">{subtitle}</motion.p>}
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
      {STATS.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 26, filter: 'blur(3px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.06 }} whileHover={{ y: -6, scale: 1.02 }}
          className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
          <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
            <Counter value={s.value} suffix={s.suffix} />
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-tm">{s.label}</div>
        </motion.div>
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
      <motion.div initial={{ opacity: 0, x: -24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }}
        transition={SPRING} whileHover={{ y: -6, scale: 1.02 }} className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-ts" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold">My Journey</h3>
        </div>
        <p className="leading-relaxed mb-4 text-sm text-ts">
          I&apos;m Salman Khan — a Full Stack Developer with an MSc in Computer Science from Sree Narayana College, Cherthala, Kerala University.
        </p>
        <p className="leading-relaxed text-sm text-ts">
          From full-stack platforms to ML-powered tools, I build software that feels effortless to use. BSc in Computer Science from Sree Ayyappa College, Chengannur.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: 0.08 }} whileHover={{ y: -6, scale: 1.02 }} className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-ts" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold">What I Value</h3>
        </div>
        <ul className="space-y-3 sm:space-y-4 text-sm">
          {[
            ['Quality over quantity', 'Code that reads like prose.'],
            ['Performance matters', 'Every millisecond counts.'],
            ['Design + Engineering', 'Beauty and function must coexist.'],
            ['Continuous learning', 'Today\'s best practice is tomorrow\'s legacy.'],
          ].map(([k, v]) => (
            <li key={k} className="flex gap-3">
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
      <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
        {categories.map((c) => {
          const Icon = SKILL_ICONS[c]
          const isActive = active === c
          return (
            <motion.button key={c} onClick={() => setActive(c)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              animate={isActive ? { y: -1 } : { y: 0 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-medium transition-all duration-300"
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
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SKILLS[active].map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 28, scale: 0.95, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ ...SPRING, delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-strong glass-interactive rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
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
        <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
          <motion.div style={{ y: imgY, scale: 1.15 }} className="absolute inset-0 parallax-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name}
              className="w-full h-full object-cover" />
          </motion.div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          {/* Project number badge */}
          <div className="absolute top-4 sm:top-5 left-4 sm:left-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full glass flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-bold text-white/90">{String(idx + 1).padStart(2, '0')}</span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1.5 sm:mb-2">{p.tagline}</div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">{p.name}</h3>
          </div>
        </div>

        {/* Content area */}
        <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
          <p className="text-sm sm:text-[15px] leading-relaxed text-ts max-w-2xl">{p.description}</p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {p.tech.map((t) => (
              <span key={t} className="px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-medium glass rounded-full text-tm">{t}</span>
            ))}
          </div>

          {/* Metrics row */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {p.metrics.map((m) => (
              <div key={m.v} className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-sm sm:text-base text-tp">{m.k}</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-tm">{m.v}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

          {/* Links */}
          <div className="flex items-center gap-3">
            <motion.a href={p.github} target="_blank" rel="noreferrer"
               whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={SPRING_FAST}
               className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 glass rounded-full text-xs font-medium text-tp">
              <Github className="w-3.5 h-3.5" /> Source Code <ArrowUpRight className="w-3 h-3 opacity-50" />
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
      <div ref={containerRef} className="relative ml-2 sm:ml-4 space-y-8 sm:space-y-12">
        {/* Vertical timeline track line */}
        <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-[2px] bg-black/10 dark:bg-white/10 rounded-full" />
        
        {/* Glowing active drawing line */}
        <motion.div 
          className="absolute left-4 sm:left-6 top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full origin-top"
          style={{ scaleY: timelineScale }}
        />
        
        {EXPERIENCE.map((e, i) => {
          const Icon = e.icon
          return (
            <div key={e.year} className="relative group">
              {/* Timeline dot/icon indicator */}
              <motion.div className="absolute left-4 sm:left-6 top-10 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-strong border border-black/10 dark:border-white/10 flex items-center justify-center z-10" whileHover={{ scale: 1.1 }} transition={SPRING_FAST}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.08 }} whileHover={{ y: -6, scale: 1.02 }}
                className="ml-10 sm:ml-16 glass-strong glass-interactive rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs font-mono mb-1 text-tm">{e.year}</div>
                  <h3 className="font-display font-bold text-base sm:text-lg mb-1">{e.role}</h3>
                  <div className="text-xs sm:text-sm mb-2 sm:mb-3 text-tm">{e.company}</div>
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {ACHIEVEMENTS.map((a, i) => {
        const Icon = a.icon
        return (
          <motion.div key={a.title} initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay: i * 0.06 }} whileHover={{ y: -6, scale: 1.02 }}
            className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 group">
            <motion.div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl glass flex items-center justify-center mb-3 sm:mb-4" whileHover={{ scale: 1.05 }} transition={SPRING_FAST}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-ts" />
            </motion.div>
            <h3 className="font-display font-bold text-sm sm:text-base mb-1">{a.title}</h3>
            <p className="text-[10px] sm:text-xs text-tm">{a.issuer}</p>
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
    <section className="py-16 sm:py-20 overflow-hidden border-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
      <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(3px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }}
        transition={SPRING}
        className="text-center mb-6 sm:mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-tm">Tech Stack</div>
      </motion.div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r to-transparent z-10 pointer-events-none" style={{ ['--tw-gradient-from']: isDark ? '#0a0a0a' : '#F2F2F2' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l to-transparent z-10 pointer-events-none" style={{ ['--tw-gradient-from']: isDark ? '#0a0a0a' : '#F2F2F2' }} />
        <div className="flex marquee gap-6 sm:gap-8 w-max">
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((t, i) => (
            <div key={i} className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap glass rounded-full text-tm">
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

const ContributionCell = memo(({ day, palette, isDark }) => {
  const tooltip = day.contributionCount
    ? `${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${new Date(day.date + 'T00:00:00').toLocaleDateString()}`
    : `No contributions on ${new Date(day.date + 'T00:00:00').toLocaleDateString()}`

  return (
    <div
      title={tooltip}
      className="contribution-cell"
      style={{
        width: CELL,
        height: CELL,
        minWidth: CELL,
        minHeight: CELL,
        flexShrink: 0,
        borderRadius: 2,
        backgroundColor: palette[day.contributionLevel],
        cursor: 'default',
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    />
  )
})
ContributionCell.displayName = 'ContributionCell'

const ContributionGrid = memo(({ weeks, total, isDark }) => {
  if (!weeks || !weeks.length) return null

  const palette = isDark ? COLORS.dark : COLORS.light

  const naturalWidth = LABEL_WIDTH + weeks.length * (CELL + GAP)

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
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...SPRING, delay: 0.1 }}
      style={{ width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
    >
      <div style={{ width: naturalWidth, maxWidth: '100%' }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 4, height: 14, position: 'relative', paddingLeft: LABEL_WIDTH }}>
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

        <div style={{ display: 'inline-flex', gap: 0, width: 'fit-content', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4, paddingTop: 1 }}>
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
              <span key={i} style={{ width: LABEL_WIDTH, height: CELL, fontSize: 10, lineHeight: `${CELL}px`, color: isDark ? '#8b949e' : '#656d76', textAlign: 'right' }}>
                {label}
              </span>
            ))}
          </div>

          <div style={{ display: 'inline-flex', gap: GAP, width: 'fit-content', flexShrink: 0 }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP, flexShrink: 0 }}>
                {week.contributionDays.map((day, di) => (
                  <ContributionCell
                    key={di}
                    day={day}
                    palette={palette}
                    isDark={isDark}
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
      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={SPRING}
          className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:col-span-2"
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
            className="mt-4 sm:mt-5 flex items-center justify-between"
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
          className="grid grid-cols-1 gap-3 sm:gap-4"
        >
          {statCards.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.k}
                className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-4 sm:p-6"
                style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              >
                <Icon className="w-4 h-4 mb-2 sm:mb-3 text-tm" />
                <div className="font-display text-base sm:text-lg font-bold">{s.v}</div>
                <div className="text-[10px] sm:text-xs text-tm">{s.k}</div>
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
            <div className="text-xs uppercase tracking-[0.2em] mb-4 px-1 text-tm">
              Recent Repositories
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {repos.slice(0, 6).map((r, i) => (
                <a
                  key={r.id}
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-4 sm:p-5 group block"
                  style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-xs sm:text-sm truncate">{r.name}</span>
                    <ArrowUpRight className="w-3 h-3 flex-shrink-0 text-tm group-hover:text-tp" />
                  </div>
                  <p className="text-[10px] sm:text-xs line-clamp-2 mb-2 text-tm">{r.description || 'No description'}</p>
                  <div className="flex items-center gap-3 text-[9px] sm:text-[10px] text-tm">
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
        <div className="glass-strong glass-interactive rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 relative min-h-[220px] sm:min-h-[260px]">
          <div className="text-4xl absolute top-5 sm:top-6 left-5 sm:left-6 text-tm">&ldquo;</div>
          <div className="relative h-40 sm:h-48 pt-6 sm:pt-8">
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, y: 18, filter: 'blur(2px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(2px)' }} transition={SPRING_FAST}
                className="absolute inset-0">
                <p className="text-base sm:text-lg leading-relaxed mb-5 sm:mb-6 text-ts">{TESTIMONIALS[idx].quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-xs font-bold">
                    {TESTIMONIALS[idx].name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{TESTIMONIALS[idx].name}</div>
                    <div className="text-xs text-tm">{TESTIMONIALS[idx].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-5 sm:mt-6">
          {TESTIMONIALS.map((_, i) => (
            <motion.button key={i} onClick={() => setIdx(i)}
              animate={{ width: idx === i ? '2rem' : '1rem', background: idx === i ? (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }}
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
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl">
        <div className="glass-strong rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6">
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
                className="flex items-center gap-3 sm:gap-4 glass glass-interactive rounded-xl p-3 sm:p-4 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 text-tm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-tm">{c.k}</div>
                  <div className="text-xs sm:text-sm truncate">{c.v}</div>
                </div>
                <ArrowUpRight className="w-3 h-3 flex-shrink-0 text-tm" />
              </motion.a>
            )
          })}
        </div>
        <motion.form onSubmit={submit} initial={{ opacity: 0, x: 25, filter: 'blur(3px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }} transition={SPRING}
          className="glass-strong rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-5">
          <div>
            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest mb-2 block text-tm">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass border-0 h-10 sm:h-11 rounded-xl text-sm focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Your name" />
          </div>
          <div>
            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest mb-2 block text-tm">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="glass border-0 h-10 sm:h-11 rounded-xl text-sm focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest mb-2 block text-tm">Message</label>
            <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="glass border-0 rounded-xl text-sm focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Tell me about your project..." />
          </div>
          <motion.button disabled={loading} type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={SPRING_FAST}
            className="w-full px-6 py-3 rounded-xl text-sm font-medium transition disabled:opacity-50 shadow-md"
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
      transition={{ type: 'spring', stiffness: 80, damping: 20 }} className="py-10 sm:py-12 px-4 sm:px-6 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
    <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
      <div className="text-xs sm:text-sm text-tm">© {new Date().getFullYear()} Salman Khan</div>
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
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 glass-strong rounded-full flex items-center justify-center shadow-lg hover:shadow-xl gpu-accel text-tp"
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
        <Toaster position="top-right" richColors theme="dark" />
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
