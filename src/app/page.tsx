'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Video, Scissors, Download, Play, Pause, Sparkles, Clock, Zap, CheckCircle2, Loader2, Plus, Trash2, Edit3, BarChart3, Share2, Settings, ChevronRight, Star, TrendingUp, Check, X, Menu, Globe, MessageCircle, Mail, Linkedin, Twitter, Youtube, Instagram, Facebook } from 'lucide-react'

interface Clip {
  id: string
  title: string
  startTime: number
  endTime: number
  duration: number
  thumbnail: string
  viralScore: number
}

interface Project {
  id: string
  name: string
  videoUrl: string
  clips: Clip[]
  createdAt: number
}

export default function OpusClipPro() {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing')
  const [step, setStep] = useState<'upload' | 'processing' | 'editing'>('upload')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [clips, setClips] = useState<Clip[]>([])
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [editingClipId, setEditingClipId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Carregar projetos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('opus-clip-projects')
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }, [])

  // Salvar projetos no localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('opus-clip-projects', JSON.stringify(projects))
    }
  }, [projects])

  // Atualizar tempo do vídeo
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [videoUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
    }
  }

  const handleProcessVideo = () => {
    if (!videoUrl) return
    
    setStep('processing')
    setProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setProcessing(false)
          generateClips()
          setStep('editing')
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const generateClips = () => {
    const generatedClips: Clip[] = [
      {
        id: '1',
        title: 'Momento Viral Principal',
        startTime: 15,
        endTime: 45,
        duration: 30,
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=225&fit=crop',
        viralScore: 95
      },
      {
        id: '2',
        title: 'Destaque Engajante',
        startTime: 60,
        endTime: 95,
        duration: 35,
        thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=225&fit=crop',
        viralScore: 88
      },
      {
        id: '3',
        title: 'Momento Épico',
        startTime: 120,
        endTime: 155,
        duration: 35,
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=225&fit=crop',
        viralScore: 82
      },
      {
        id: '4',
        title: 'Clipe Impactante',
        startTime: 180,
        endTime: 210,
        duration: 30,
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop',
        viralScore: 76
      },
      {
        id: '5',
        title: 'Conteúdo Relevante',
        startTime: 240,
        endTime: 268,
        duration: 28,
        thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop',
        viralScore: 71
      }
    ]

    setClips(generatedClips)
    setSelectedClip(generatedClips[0])
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: videoFile?.name || 'Novo Projeto',
      videoUrl,
      clips: generatedClips,
      createdAt: Date.now()
    }
    
    setCurrentProject(newProject)
    setProjects(prev => [newProject, ...prev])
  }

  const handlePlayClip = (clip: Clip) => {
    setSelectedClip(clip)
    if (videoRef.current) {
      videoRef.current.currentTime = clip.startTime
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDeleteClip = (clipId: string) => {
    setClips(prev => prev.filter(c => c.id !== clipId))
    if (selectedClip?.id === clipId) {
      setSelectedClip(clips.find(c => c.id !== clipId) || null)
    }
  }

  const handleEditClip = (clip: Clip) => {
    setEditingClipId(clip.id)
    setEditTitle(clip.title)
  }

  const handleSaveEdit = (clipId: string) => {
    setClips(prev => prev.map(c => 
      c.id === clipId ? { ...c, title: editTitle } : c
    ))
    setEditingClipId(null)
  }

  const handleDownloadClip = (clip: Clip) => {
    alert(`🎬 Exportando "${clip.title}"!\n\n✅ Formatos disponíveis:\n• Instagram Reels (9:16)\n• TikTok (9:16)\n• YouTube Shorts (9:16)\n• Twitter/X (16:9)\n\n📊 Score Viral: ${clip.viralScore}/100`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getViralScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    if (score >= 75) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
  }

  const resetApp = () => {
    setStep('upload')
    setVideoFile(null)
    setVideoUrl('')
    setClips([])
    setSelectedClip(null)
    setCurrentProject(null)
    setIsPlaying(false)
  }

  const startApp = () => {
    setCurrentView('app')
  }

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  Opus<span className="text-purple-600">Clip</span>
                </span>
              </div>

              {/* Desktop Menu */}
              <nav className="hidden lg:flex items-center gap-8">
                <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Pricing</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">How It Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Testimonials</a>
              </nav>

              <div className="flex items-center gap-3">
                <button className="hidden sm:block px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                  Sign In
                </button>
                <button 
                  onClick={startApp}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-600/30"
                >
                  Try Free
                </button>
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col gap-4">
                  <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium">Features</a>
                  <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium">Pricing</a>
                  <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium">How It Works</a>
                  <a href="#testimonials" className="text-gray-700 hover:text-purple-600 font-medium">Testimonials</a>
                  <a href="#" className="text-gray-700 hover:text-purple-600 font-medium">Sign In</a>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">AI-Powered Video Clipping</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Long Videos Into
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Viral Short Clips
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              AI identifies the most engaging moments from your videos and creates ready-to-post clips for TikTok, Instagram Reels, and YouTube Shorts in one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={startApp}
                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-all">
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Free 7-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Video */}
        <section className="pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&h=675&fit=crop" 
                alt="Demo"
                className="w-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button className="bg-white/20 backdrop-blur-sm p-6 rounded-full hover:scale-110 transition-transform">
                  <Play className="w-12 h-12 text-white ml-1" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to create viral content at scale
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Curation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI analyzes your video and automatically identifies the most engaging moments worth sharing.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate 10+ clips from a 1-hour video in under 5 minutes. Save hours of manual editing.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Viral Score</h3>
                <p className="text-gray-600 leading-relaxed">
                  Each clip gets a virality score based on engagement patterns from millions of videos.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Share2 className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Platform</h3>
                <p className="text-gray-600 leading-relaxed">
                  Export optimized clips for TikTok, Instagram Reels, YouTube Shorts, and more.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Settings className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Full Customization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Edit titles, adjust timing, add captions, and customize every aspect of your clips.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track performance of your clips and understand what content resonates with your audience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your needs. All plans include a 7-day free trial.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-all">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                  <p className="text-gray-600">Perfect for trying out</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">$9</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
                </div>
                <button className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-all mb-6">
                  Start Free Trial
                </button>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">30 video processing minutes/month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">AI-powered clip generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1080p exports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">Priority support</span>
                  </li>
                </ul>
              </div>

              {/* Creator Plan - Popular */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 relative transform scale-105 hover:scale-110 transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Creator</h3>
                  <p className="text-purple-100">For serious creators</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">$29</span>
                    <span className="text-purple-100">/month</span>
                  </div>
                  <p className="text-sm text-purple-200 mt-2">Billed monthly</p>
                </div>
                <button className="w-full py-3 px-6 bg-white hover:bg-gray-100 text-purple-600 font-semibold rounded-xl transition-all mb-6 shadow-lg">
                  Start Free Trial
                </button>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">300 video processing minutes/month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">AI-powered clip generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">4K exports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white">Custom branding</span>
                  </li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-all">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                  <p className="text-gray-600">For power users</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">$99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
                </div>
                <button className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-all mb-6">
                  Start Free Trial
                </button>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1200 video processing minutes/month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">AI-powered clip generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">4K exports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom branding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">API access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Team collaboration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create viral clips in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Video</h3>
                <p className="text-gray-600">
                  Upload your long-form video from YouTube, Zoom, or your device
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Processing</h3>
                <p className="text-gray-600">
                  Our AI analyzes your video and identifies the most engaging moments
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Export & Share</h3>
                <p className="text-gray-600">
                  Download your clips and share them across all social platforms
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Loved by Creators
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of content creators who trust OpusClip
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "OpusClip has completely transformed my content workflow. What used to take hours now takes minutes!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Content Creator</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "The AI is incredibly accurate at finding the best moments. My engagement has increased by 300%!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Mike Chen</p>
                    <p className="text-sm text-gray-600">YouTuber</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "Best investment I've made for my content business. The ROI is incredible!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Emma Davis</p>
                    <p className="text-sm text-gray-600">Podcaster</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Go Viral?
            </h2>
            <p className="text-lg sm:text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
              Join thousands of creators who are already using OpusClip to grow their audience
            </p>
            <button 
              onClick={startApp}
              className="px-8 py-4 bg-white hover:bg-gray-100 text-purple-600 font-semibold rounded-xl transition-all shadow-xl inline-flex items-center gap-2"
            >
              Start Your Free Trial
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-purple-100 mt-6">No credit card required • 7-day free trial</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                    <Scissors className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    Opus<span className="text-purple-400">Clip</span>
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  AI-powered video clipping for content creators
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Integrations</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                © 2024 OpusClip. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // App View (Editor)
  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#13131A]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-2.5 rounded-xl shadow-lg shadow-purple-500/20">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Opus<span className="text-[#8B5CF6]">Clip</span>
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">AI-Powered Video Clipping</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {step !== 'upload' && (
                <button
                  onClick={resetApp}
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Project</span>
                </button>
              )}
              <button
                onClick={() => setCurrentView('landing')}
                className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Step */}
      {step === 'upload' && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-sm text-[#8B5CF6] font-medium">Powered by AI</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Turn Long Videos Into
              <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                Viral Clips
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              AI identifies the most engaging moments and creates ready-to-post clips for TikTok, Instagram, and YouTube
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-[#13131A] rounded-3xl shadow-2xl p-6 sm:p-12 border border-gray-800">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!videoFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 rounded-2xl p-12 sm:p-16 text-center cursor-pointer hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all group"
              >
                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                  Upload Your Video
                </h3>
                <p className="text-gray-400 mb-4">
                  Drag and drop or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports MP4, MOV, AVI • Max 2GB
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl">
                  <div className="bg-[#10B981] p-2.5 rounded-lg">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{videoFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    src={videoUrl}
                    className="w-full"
                    controls
                  />
                </div>

                <button
                  onClick={handleProcessVideo}
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Clips with AI
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
          <div className="bg-[#13131A] rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-800">
            <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-500/30">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Processing Your Video
            </h2>
            <p className="text-gray-400 mb-8">
              Our AI is analyzing and identifying the best moments
            </p>

            <div className="space-y-4">
              <div className="bg-[#0B0B0F] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] h-full transition-all duration-300 rounded-full shadow-lg shadow-purple-500/50"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                {progress}%
              </p>
            </div>

            <div className="mt-10 space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="bg-[#10B981]/20 p-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                Analyzing audio and video content
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="bg-[#10B981]/20 p-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                Detecting viral moments with AI
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="bg-[#8B5CF6]/20 p-1.5 rounded-full">
                  <Loader2 className="w-4 h-4 text-[#8B5CF6] animate-spin" />
                </div>
                Generating optimized clips
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editing Step */}
      {step === 'editing' && (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Preview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#13131A] rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                      {selectedClip ? selectedClip.title : 'Select a clip'}
                    </h3>
                    {selectedClip && (
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {formatTime(selectedClip.startTime)} - {formatTime(selectedClip.endTime)}
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${getViralScoreColor(selectedClip.viralScore)}`}>
                          <Star className="w-3 h-3" />
                          {selectedClip.viralScore}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative bg-black rounded-xl overflow-hidden aspect-video group">
                  {videoUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full"
                        onEnded={() => setIsPlaying(false)}
                      />
                      <button
                        onClick={togglePlayPause}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all"
                      >
                        <div className="bg-white/20 backdrop-blur-sm p-4 sm:p-6 rounded-full group-hover:scale-110 transition-transform">
                          {isPlaying ? (
                            <Pause className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                          ) : (
                            <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white ml-1" />
                          )}
                        </div>
                      </button>

                      {selectedClip && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="bg-gray-700 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-[#8B5CF6] h-full transition-all"
                              style={{
                                width: `${((currentTime - selectedClip.startTime) / selectedClip.duration) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <Video className="w-16 h-16" />
                    </div>
                  )}
                </div>

                {selectedClip && (
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDownloadClip(selectedClip)}
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                    >
                      <Download className="w-5 h-5" />
                      Export Clip
                    </button>
                    <button
                      className="bg-[#0B0B0F] hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-800"
                    >
                      <Settings className="w-5 h-5" />
                      Customize
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              {selectedClip && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#13131A] p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <BarChart3 className="w-4 h-4" />
                      Viral Score
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedClip.viralScore}</p>
                  </div>
                  <div className="bg-[#13131A] p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Duration
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedClip.duration}s</p>
                  </div>
                  <div className="bg-[#13131A] p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <Scissors className="w-4 h-4" />
                      Total Clips
                    </div>
                    <p className="text-2xl font-bold text-white">{clips.length}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Clips List */}
            <div className="space-y-6">
              <div className="bg-[#13131A] rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Generated Clips
                  </h3>
                  <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] px-3 py-1 rounded-full text-sm font-semibold">
                    {clips.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                  {clips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className={`group relative border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${
                        selectedClip?.id === clip.id
                          ? 'border-[#8B5CF6] shadow-lg shadow-purple-500/20 scale-[1.02]'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                      onClick={() => handlePlayClip(clip)}
                    >
                      <div className="relative">
                        <img
                          src={clip.thumbnail}
                          alt={clip.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <span className="text-white text-xs font-bold">#{index + 1}</span>
                        </div>

                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-semibold">
                          {clip.duration}s
                        </div>

                        <div className={`absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${getViralScoreColor(clip.viralScore)}`}>
                          <Star className="w-3 h-3" />
                          {clip.viralScore}
                        </div>

                        <div className="absolute bottom-2 left-2 right-20">
                          {editingClipId === clip.id ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => handleSaveEdit(clip.id)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(clip.id)}
                              className="w-full bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded text-sm font-medium"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <p className="text-white font-semibold text-sm truncate">{clip.title}</p>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-[#0B0B0F]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditClip(clip)
                              }}
                              className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClip(clip.id)
                              }}
                              className="p-1.5 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0B0B0F;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8B5CF6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
      `}</style>
    </div>
  )
}
