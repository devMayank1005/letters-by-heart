import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  children: ReactNode;
  to?: string;
}

export default function Envelope({ isOpen, onOpen, children, to }: EnvelopeProps) {
  return (
    <div className="relative w-full max-w-sm aspect-[4/3] perspective-1000 mx-auto mt-12 mb-24">
      {/* The Letter */}
      <motion.div
        layout
        initial={false}
        animate={isOpen ? {
          y: [0, -300, -20],
          scale: [0.95, 0.95, 1.05],
          opacity: 1,
          zIndex: [5, 5, 40],
          rotate: [2, 0, 0],
        } : {
          y: 0,
          scale: 0.95,
          opacity: 0.6,
          zIndex: 5,
          rotate: 2,
        }}
        transition={{
          duration: isOpen ? 2.5 : 1,
          times: isOpen ? [0, 0.5, 1] : undefined,
          ease: "easeInOut",
          delay: isOpen ? 0.4 : 0
        }}
        className={`absolute inset-x-4 bg-art-paper shadow-2xl rounded-sm p-6 border border-black/5 ring-1 ring-black/5 ${isOpen ? 'top-[-50px] bottom-auto min-h-[400px]' : 'top-4 bottom-4'}`}
      >
        <div className="h-full w-full overflow-hidden relative">
           {/* Subtle paper texture */}
           <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-art-ink) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
           <div className="relative z-10 h-full">
            {children}
           </div>
        </div>
      </motion.div>

      {/* Envelope Container */}
      <motion.div 
        animate={{ 
          scale: isOpen ? 1.05 : 1,
          rotateX: isOpen ? 10 : 0,
          y: isOpen ? 40 : 0
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 preserve-3d cursor-pointer z-10"
        onClick={!isOpen ? onOpen : undefined}
      >
        {/* Back side of the envelope */}
        <div className="absolute inset-0 bg-pink-600 shadow-2xl rounded-lg overflow-hidden border border-black/20">
           {/* Decorative pattern for inside */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-art-paper)_1px,_transparent_1px)] bg-[size:12px_12px]" />
        </div>

        {/* The Flap */}
        <motion.div 
          initial={false}
          animate={{ rotateX: isOpen ? -180 : 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "top" }}
          className="absolute inset-x-0 top-0 h-1/2 bg-pink-400 z-30 preserve-3d"
        >
          {/* Front of flap */}
          <div className="absolute inset-0 backface-hidden flex items-start justify-center pt-2">
            <div className="w-full h-full bg-pink-400 shadow-inner" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} 
            />
            {!isOpen && (
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Heart className="text-art-paper fill-pink-500 drop-shadow-lg" size={40} strokeWidth={1} />
                <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-art-paper/60 font-medium">Seal</div>
              </motion.div>
            )}
          </div>
          {/* Back of flap (visible when open) */}
          <div className="absolute inset-0 backface-hidden bg-pink-600 rotate-x-180"
               style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} 
          />
        </motion.div>

        {/* Envelope Front (Pocket) */}
        <div className="absolute inset-0 z-25 pointer-events-none">
          {/* Left Wing */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-pink-500 shadow-lg border-r border-black/5"
               style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
          />
          {/* Right Wing */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-pink-500 shadow-lg border-l border-black/5"
               style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
          />
          {/* Bottom Wing */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-pink-600 shadow-2xl"
               style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0%)' }}
          >
             <div className="absolute bottom-6 left-0 right-0 text-center opacity-90 text-art-paper text-2xl font-script tracking-wide">
                To, {to || 'Someone Special'}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
