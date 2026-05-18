import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  children: ReactNode;
}

export default function Envelope({ isOpen, onOpen, children }: EnvelopeProps) {
  return (
    <div className="relative w-full max-w-sm aspect-[4/3] perspective-1000 mx-auto mt-12 mb-24">
      {/* The Letter */}
      <motion.div
        initial={false}
        animate={{
          y: isOpen ? -100 : 0,
          scale: isOpen ? 1.05 : 0.95,
          opacity: isOpen ? 1 : 0.6,
          zIndex: isOpen ? 40 : 5,
          rotate: isOpen ? 0 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 15,
          delay: isOpen ? 1.2 : 0
        }}
        className={`absolute inset-x-4 bg-art-paper shadow-2xl rounded-sm p-6 border border-black/5 ring-1 ring-black/5 transition-all duration-[1.5s] ${isOpen ? 'top-[-50px] bottom-auto min-h-[400px]' : 'top-4 bottom-4'}`}
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
        <div className="absolute inset-0 bg-art-red-deep shadow-2xl rounded-lg overflow-hidden border border-black/20">
           {/* Decorative pattern for inside */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-art-paper)_1px,_transparent_1px)] bg-[size:12px_12px]" />
        </div>

        {/* The Flap */}
        <motion.div 
          initial={false}
          animate={{ rotateX: isOpen ? -170 : 0 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: "top" }}
          className="absolute inset-x-0 top-0 h-1/2 bg-art-red-light z-30 preserve-3d"
        >
          {/* Front of flap */}
          <div className="absolute inset-0 backface-hidden flex items-start justify-center pt-2">
            <div className="w-full h-full bg-art-red-light shadow-inner" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} 
            />
            {!isOpen && (
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Heart className="text-art-paper fill-art-red-bright drop-shadow-lg" size={40} strokeWidth={1} />
                <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-art-paper/60 font-medium">Seal</div>
              </motion.div>
            )}
          </div>
          {/* Back of flap (visible when open) */}
          <div className="absolute inset-0 backface-hidden bg-art-red-deep rotate-x-180"
               style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} 
          />
        </motion.div>

        {/* Envelope Front (Pocket) */}
        <div className="absolute inset-0 z-25 pointer-events-none">
          {/* Left Wing */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-art-red-bright shadow-lg border-r border-black/5"
               style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
          />
          {/* Right Wing */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-art-red-bright shadow-lg border-l border-black/5"
               style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
          />
          {/* Bottom Wing */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-art-red-deep shadow-2xl"
               style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0%)' }}
          >
             <div className="absolute bottom-4 left-0 right-0 text-center opacity-30 text-art-paper text-[10px] tracking-[0.3em] font-sans uppercase">
                Artisanal Delivery
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
