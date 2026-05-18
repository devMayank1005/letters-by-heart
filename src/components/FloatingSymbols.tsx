import { motion } from 'motion/react';
import { Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Symbol {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'heart' | 'star';
  rotation: number;
}

export default function FloatingSymbols() {
  const [symbols, setSymbols] = useState<Symbol[]>([]);

  useEffect(() => {
    const newSymbols: Symbol[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 15 + Math.random() * 25,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
      type: Math.random() > 0.5 ? 'heart' : 'star',
      rotation: Math.random() * 360,
    }));
    setSymbols(newSymbols);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((sym) => (
        <motion.div
          key={sym.id}
          initial={{ 
            opacity: 0, 
            y: '110vh', 
            x: `${sym.x}vw`,
            rotate: sym.rotation
          }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0],
            y: '-10vh',
            rotate: sym.rotation + 360
          }}
          transition={{
            duration: sym.duration,
            delay: sym.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{ width: sym.size, height: sym.size }}
        >
          {sym.type === 'heart' ? (
            <Heart className="text-art-red-bright fill-art-red-bright opacity-30" size={sym.size} />
          ) : (
            <Star className="text-art-gold fill-art-gold opacity-30" size={sym.size} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
