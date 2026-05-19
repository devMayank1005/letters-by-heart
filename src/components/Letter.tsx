import { useState, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LetterProps {
  to: string;
  from: string;
  content: string;
  images: string[];
  createdAt?: string | null;
  openedAt?: string | null;
}

export default function Letter({ to, from, content, images, createdAt, openedAt }: LetterProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null && images) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null && images) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleDragEnd = (e: any, { offset }: PanInfo) => {
    const swipeThreshold = 50;
    if (offset.x < -swipeThreshold) {
      handleNext();
    } else if (offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <>
      <div className="font-serif text-art-ink leading-relaxed pr-2">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 2, ease: "easeOut" }}
      >
        <div className="flex justify-between items-start text-[9px] font-sans italic mb-8 opacity-40 uppercase tracking-[0.2em] space-x-4 text-left">
          {createdAt ? (
            <div>
              <span className="block opacity-70 mb-1 tracking-[0.3em]">Written On</span>
              {new Date(createdAt).toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', 
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          ) : (
             <div className="opacity-0">Placeholder</div>
          )}
          
          {openedAt ? (
            <div className="text-right">
              <span className="block opacity-70 mb-1 tracking-[0.3em]">Opened On</span>
              {new Date(openedAt).toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', 
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          ) : (
             <div className="text-right">
                <span className="block opacity-70 mb-1 tracking-[0.3em]">&nbsp;</span>
                Sealed
             </div>
          )}
        </div>
        
        <p className="text-3xl mb-10 border-b border-art-ink/5 pb-6 font-script">{to || 'One'},</p>
        
        <div className="space-y-6 text-lg font-light leading-loose tracking-wide text-art-ink/90">
          {content ? (
            content.split('\n').map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <>
              <p>I find myself writing this under the soft glow of the stars...</p>
              <p>Every moment spent apart feels like a heartbeat missed...</p>
            </>
          )}
        </div>

        {images && images.length > 0 && (
          <div className="columns-2 sm:columns-3 gap-4 space-y-4 my-12">
            {images.map((img, idx) => {
              const rotations = ['rotate-2', '-rotate-2', 'rotate-1', '-rotate-3', 'rotate-3'];
              const randomRotation = rotations[idx % rotations.length];
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 2.5 + idx * 0.2, duration: 0.8 }}
                  className={`relative rounded-md overflow-hidden shadow-xl ring-4 ring-white transform ${randomRotation} cursor-zoom-in hover:scale-105 hover:z-10 transition-transform duration-300 break-inside-avoid`}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-auto object-cover" />
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-16 flex flex-col items-center">
          <div className="text-art-red-bright text-4xl mb-4 drop-shadow-sm">♥</div>
          <p className="text-3xl mt-4 font-script text-art-ink tracking-normal">{from || 'Julian'}</p>
        </div>
        
        <div className="flex justify-between mt-16 opacity-30 text-[8px] tracking-[0.5em] text-art-gold">
          <span>★ ★ ★</span>
          <span>★ ★ ★</span>
        </div>
      </motion.div>
    </div>
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
              onClick={() => setSelectedIndex(null)}
            >
              {/* Close Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white z-50 p-2 bg-black/20 rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={28} />
              </button>

              {/* Prev Button */}
              {images.length > 1 && (
                <button 
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-2 bg-black/20 rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
              )}

              {/* Next Button */}
              {images.length > 1 && (
                <button 
                  onClick={handleNext}
                  className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-2 bg-black/20 rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronRight size={32} />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  src={images[selectedIndex]}
                  alt="Expanded view"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-grab active:cursor-grabbing pointer-events-auto"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
