import { motion } from 'motion/react';

interface LetterProps {
  to: string;
  from: string;
  content: string;
  images: string[];
}

export default function Letter({ to, from, content, images }: LetterProps) {
  return (
    <div className="font-georgia text-art-ink leading-relaxed pr-2">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 2, ease: "easeOut" }}
      >
        <div className="text-right text-[9px] font-sans italic mb-8 opacity-30 uppercase tracking-[0.3em]">Paris, France</div>
        
        <p className="text-3xl mb-10 border-b border-art-ink/5 pb-6 font-script">{to || 'One'},</p>
        
        <div className="space-y-8 text-xl leading-loose">
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
          <div className="grid grid-cols-1 gap-6 my-12">
            {images.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 2.5 + idx * 0.3, duration: 1 }}
                className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg ring-1 ring-black/10 transform rotate-1"
              >
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col items-center">
          <div className="text-art-red-bright text-4xl mb-4 drop-shadow-sm">♥</div>
          <p className="text-xl italic font-light opacity-80">Always and Forever yours,</p>
          <p className="text-3xl mt-4 font-script text-art-ink tracking-normal">{from || 'Julian'}</p>
        </div>
        
        <div className="flex justify-between mt-16 opacity-30 text-[8px] tracking-[0.5em] text-art-gold">
          <span>★ ★ ★</span>
          <span>★ ★ ★</span>
        </div>
      </motion.div>
    </div>
  );
}
