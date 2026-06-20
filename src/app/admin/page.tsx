'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleFullScrape = async () => {
    if (!secret) {
      toast.error('Admin secret key gerekli')
      return
    }

    setLoading(true)
    addLog('Tam scraping başlatılıyor...')

    try {
      const response = await fetch('/api/scrape/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, action: 'full' })
      })

      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        addLog(`Hata: Sunucu geçersiz yanıt döndürdü (HTTP ${response.status})`)
        addLog(`Yanıt: ${text.substring(0, 200)}`)
        toast.error(`Sunucu hatası (HTTP ${response.status})`)
        return
      }

      if (response.ok) {
        toast.success(data.message)
        addLog(data.message)
      } else {
        toast.error(data.error || 'Bir hata oluştu')
        addLog(`Hata: ${data.error || 'Bilinmeyen hata'}`)
      }
    } catch (error: any) {
      toast.error('İstek gönderilirken hata oluştu')
      addLog(`Hata: ${error?.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSingleScrape = async () => {
    if (!secret || !url) {
      toast.error('Admin secret key ve URL gerekli')
      return
    }

    setLoading(true)
    addLog(`Tekil scraping başlatılıyor: ${url}`)

    try {
      const response = await fetch('/api/scrape/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, action: 'single', url })
      })

      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        addLog(`Hata: Sunucu geçersiz yanıt döndürdü (HTTP ${response.status})`)
        addLog(`Yanıt: ${text.substring(0, 200)}`)
        toast.error(`Sunucu hatası (HTTP ${response.status})`)
        return
      }

      if (response.ok) {
        toast.success(data.success ? 'Film kaydedildi' : 'Film zaten mevcut veya kaydedilemedi')
        addLog(data.success ? `Kaydedildi: ${data.film?.title}` : 'Kaydedilemedi veya zaten mevcut')
        if (data.film) {
          addLog(`Başlık: ${data.film.title}`)
          addLog(`IMDb: ${data.film.imdb_rating || 'N/A'} | Yıl: ${data.film.year || 'N/A'}`)
        }
      } else {
        toast.error(data.error || 'Bir hata oluştu')
        addLog(`Hata: ${data.error || 'Bilinmeyen hata'}`)
        if (data.debug) {
          addLog(`Debug - Status: ${data.debug.status}, OK: ${data.debug.ok}, HTML uzunluk: ${data.debug.htmlLength}`)
          addLog(`Debug - H1 var: ${data.debug.hasH1}, H1: ${data.debug.h1Text}`)
          addLog(`Debug - İlk 500: ${data.debug.first500chars?.substring(0, 200)}`)
        }
      }
    } catch (error: any) {
      toast.error('İstek gönderilirken hata oluştu')
      addLog(`Hata: ${error?.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>

        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Güvenlik</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Admin Secret Key
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="ADMIN_SECRET_KEY değerini girin"
              className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Scraping İşlemleri</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Tekil Film URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.hdfilmcehennemi.nl/film-adı/"
                  className="flex-1 bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  onClick={handleSingleScrape}
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800 text-white font-medium rounded-lg transition-colors"
                >
                  Tekil Çek
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-dark-700">
              <button
                onClick={handleFullScrape}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
              >
                {loading ? 'İşleniyor...' : 'Tam Siteyi Çek'}
              </button>
              <p className="text-dark-400 text-sm">
                Bu işlem tüm siteyi tarar ve filmleri veritabanına ekler.
              </p>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Loglar</h2>
          <div className="bg-dark-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-dark-500">Henüz log yok...</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <p key={index} className="text-dark-300">{log}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
