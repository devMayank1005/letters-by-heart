/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Music, Image as ImageIcon, Plus, Trash2, Play, Pause, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import FloatingSymbols from './components/FloatingSymbols';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  
  // Letter Data
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [ytLink, setYtLink] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [requiredPasscode, setRequiredPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [enteredPasscode, setEnteredPasscode] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setIsCreating(false);
      fetch(`/api/letters/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.to) setTo(data.to);
          if (data.from) setFrom(data.from);
          if (data.content) setContent(data.content);
          if (data.images) setImages(data.images);
          if (data.ytLink) setYtLink(data.ytLink);
          if (data.passcode) {
            setRequiredPasscode(data.passcode);
            setIsUnlocked(false);
          }
        })
        .catch(err => console.error('Failed to load letter:', err));
    }
  }, []);

  const getYTId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    
    // Celebratory hearts and stars
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 20 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#d94e4e', '#fefae0'],
        shapes: ['circle'],
        gravity: 0.5,
        scalar: 0.8,
        drift: 0,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#d4af37', '#ffffff'],
        shapes: ['star'],
        gravity: 0.4,
        scalar: 1,
        drift: 0,
      });
    }, 400);
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const ytId = getYTId(ytLink);

  const handleSeal = async () => {
    if (!to && !from && !content) {
      setIsCreating(false);
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, from, content, images, ytLink, passcode })
      });
      const data = await res.json();
      if (data.id) {
        window.history.pushState({}, '', `?id=${data.id}`);
      }
    } catch (err) {
      console.error('Failed to save letter:', err);
    } finally {
      setIsSaving(false);
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-art-back text-art-paper p-6 flex flex-col items-center">
        <FloatingSymbols />
        <div className="relative z-10 w-full max-w-xl bg-art-paper/5 backdrop-blur-sm p-8 rounded-lg border border-art-paper/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-script text-4xl mb-2 text-art-paper">The Correspondence</h1>
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-sans">Crafting a Memory</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-sans">For</label>
                <input 
                  type="text" 
                  value={to} 
                  onChange={e => setTo(e.target.value)}
                  placeholder="Their Name"
                  className="w-full bg-transparent border-b border-art-paper/10 py-2 focus:border-art-gold transition-colors outline-none font-script text-2xl placeholder:opacity-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-sans">From</label>
                <input 
                  type="text" 
                  value={from} 
                  onChange={e => setFrom(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-transparent border-b border-art-paper/10 py-2 focus:border-art-gold transition-colors outline-none font-script text-2xl placeholder:opacity-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-sans">The Message</label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Pour your heart out onto this digital parchment..."
                rows={5}
                className="w-full bg-transparent border border-art-paper/10 p-6 rounded-sm focus:border-art-gold transition-colors outline-none font-serif text-lg resize-none placeholder:opacity-20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 font-sans">
                <Lock size={12} /> Secret Passcode (Optional)
              </label>
              <input 
                type="text"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="e.g. 310110"
                className="w-full bg-art-paper/5 border border-art-paper/10 py-3 px-4 rounded-sm text-sm text-art-paper outline-none focus:border-art-gold transition-colors placeholder:opacity-20 font-mono tracking-widest"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 font-sans">
                  <Music size={12} /> Soundtrack URL
                </label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="text"
                    value={ytLink}
                    onChange={e => setYtLink(e.target.value)}
                    placeholder="YouTube or YT Music Link"
                    className="w-full bg-art-paper/5 border border-art-paper/10 p-3 rounded-sm text-sm text-art-paper outline-none focus:border-art-gold transition-colors placeholder:opacity-20"
                  />
                  {ytId && (
                    <div className="flex items-center gap-2 text-[10px] text-art-gold italic tracking-widest uppercase">
                      <div className="w-1 h-1 bg-art-gold rounded-full animate-ping" />
                      Atmosphere Loaded
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 font-sans">
                  <ImageIcon size={12} /> Visual Memories
                </label>
                <div className="flex flex-wrap gap-3">
                  <label className="cursor-pointer bg-art-paper/5 hover:bg-art-paper/10 p-4 rounded-sm transition-colors border border-dashed border-art-paper/10 group">
                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {images.map((img, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-sm overflow-hidden group border border-art-paper/10 shadow-lg">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-art-red-deep/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSeal}
              disabled={isSaving}
              className="w-full bg-art-red-bright hover:bg-art-red-deep text-art-paper font-sans text-[10px] tracking-[0.5em] uppercase py-5 rounded-full transition-all mt-10 shadow-2xl shadow-art-red-deep/30 group overflow-hidden relative disabled:opacity-50"
            >
              <span className="relative z-10">{isSaving ? 'Sealing...' : 'Seal with a Heart'}</span>
              <motion.div 
                className="absolute inset-0 bg-white/10 translate-x-[-100%]"
                whileHover={{ translateX: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-art-back text-art-paper p-6 flex flex-col items-center justify-center">
        <FloatingSymbols />
        <div className="relative z-10 w-full max-w-sm bg-art-paper/5 backdrop-blur-sm p-8 rounded-lg border border-art-paper/10 shadow-2xl text-center">
          <Lock size={40} className="mx-auto mb-6 text-art-red-bright opacity-80" />
          <h2 className="font-serif italic text-2xl mb-6">Sealed with a Secret</h2>
          <div className="space-y-4">
            <input 
              type="password"
              value={enteredPasscode}
              onChange={e => setEnteredPasscode(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full bg-transparent border-b border-art-paper/20 py-3 text-center focus:border-art-gold transition-colors outline-none font-mono tracking-widest text-lg placeholder:opacity-20 placeholder:font-sans placeholder:tracking-normal"
            />
            {enteredPasscode && enteredPasscode !== requiredPasscode && (
              <p className="text-art-red-bright text-[10px] uppercase tracking-widest mt-2">Incorrect passcode</p>
            )}
            <button 
              onClick={() => {
                if (enteredPasscode === requiredPasscode) setIsUnlocked(true);
              }}
              className="w-full bg-art-gold/20 hover:bg-art-gold/30 text-art-gold font-sans text-[10px] tracking-[0.4em] uppercase py-3 rounded-full transition-colors mt-4"
            >
              Unlock Letter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-x-hidden bg-art-back text-art-paper">
      <FloatingSymbols />

      <main className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.8 } }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-4 opacity-20">
                <Star size={12} className="text-art-gold fill-art-gold" />
                <Heart size={12} className="text-art-red-bright fill-art-red-bright" />
                <Star size={12} className="text-art-gold fill-art-gold" />
              </div>
              <p className="font-sans text-[9px] tracking-[0.6em] uppercase text-art-gold/40 font-medium">
                Private Correspondence
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full relative py-8">
          <Envelope isOpen={isOpen} onOpen={handleOpen}>
            <Letter 
              to={to}
              from={from}
              content={content}
              images={images}
            />
          </Envelope>
        </div>

        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-art-red-bright bg-art-paper/5 p-4 rounded-full backdrop-blur-sm border border-art-paper/10"
                >
                  <motion.div className="text-[10px] font-sans tracking-[0.4em] uppercase opacity-70">
                    Tap the seal to reveal
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-32 flex flex-col items-center gap-6 relative z-50 bg-art-back/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-art-paper/10"
          >
             {ytId && (
               <div className="flex flex-col items-center gap-4">
                 <div className="w-64 aspect-video rounded-lg overflow-hidden border border-art-paper/10 shadow-2xl">
                   <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`} 
                      title="YouTube Music"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                 </div>
                 <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-art-paper/40 italic">
                   <Music size={10} /> Now Playing Soundtrack
                 </div>
               </div>
             )}
             
             <button 
               onClick={() => {
                 navigator.clipboard.writeText(window.location.href);
                 alert('Share link copied to clipboard!');
               }}
               className="font-sans text-[10px] tracking-[0.4em] uppercase text-art-gold hover:text-white transition-colors border-b border-art-gold/30 pb-1 mb-2 mt-4"
             >
               Copy Share Link
             </button>

             <div className="flex gap-6 items-center">
               <button 
                 onClick={() => {
                   setIsOpen(false);
                 }}
                 className="font-sans text-[10px] tracking-[0.4em] uppercase text-art-paper/50 hover:text-art-red-bright transition-colors border-b border-white/10 pb-1"
               >
                 Close Envelope
               </button>

               <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsCreating(true);
                  setIsUnlocked(true);
                  window.history.pushState({}, '', '/');
                }}
                className="font-sans text-[10px] tracking-[0.4em] uppercase text-art-paper/30 hover:text-art-red-bright transition-colors border-b border-white/5 pb-1"
              >
                Back to Editor
              </button>

              <button 
                onClick={() => {
                  const currentFrom = from;
                  const currentTo = to;
                  setIsOpen(false);
                  setIsCreating(true);
                  setIsUnlocked(true);
                  setTo(currentFrom);
                  setFrom(currentTo);
                  setContent('');
                  setImages([]);
                  setYtLink('');
                  setPasscode('');
                  window.history.pushState({}, '', '/');
                }}
                className="font-sans text-[10px] tracking-[0.4em] uppercase text-art-gold hover:text-white transition-colors border-b border-art-gold/30 pb-1"
              >
                Reply
              </button>
             </div>
          </motion.div>
        )}
      </main>

      <footer className="fixed bottom-6 text-center z-10 pointer-events-none">
        <div className="flex flex-col items-center gap-2 text-art-paper/20">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-current" />
            <span className="font-serif italic text-xs tracking-widest uppercase">Fin</span>
            <div className="h-[1px] w-12 bg-current" />
          </div>
          <div className="text-[8px] tracking-[0.5em] uppercase font-sans">Artisanal Love Notes</div>
        </div>
      </footer>
    </div>
  );
}

