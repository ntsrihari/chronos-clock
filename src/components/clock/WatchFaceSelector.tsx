import { motion } from 'framer-motion';
import { WatchFaceType } from '@/types/clock';
import { cn } from '@/lib/utils';

interface WatchFaceSelectorProps {
  currentFace: WatchFaceType;
  onSelect: (face: WatchFaceType) => void;
}

const faces: { id: WatchFaceType; name: string; color: string }[] = [
  { id: 'luxury', name: 'Luxury', color: 'hsl(45, 80%, 55%)' },
  { id: 'minimal', name: 'Minimal', color: 'hsl(0, 0%, 90%)' },
  { id: 'digital', name: 'Digital', color: 'hsl(141, 76%, 48%)' },
  { id: 'sporty', name: 'Sport', color: 'hsl(25, 95%, 55%)' },
  { id: 'neon', name: 'Neon', color: 'hsl(280, 75%, 55%)' },
];

export function WatchFaceSelector({ currentFace, onSelect }: WatchFaceSelectorProps) {
  return (
    <div className="flex gap-2 p-1 glass rounded-full">
      {faces.map((face) => (
        <motion.button
          key={face.id}
          onClick={() => onSelect(face.id)}
          className={cn(
            'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
            currentFace === face.id
              ? 'text-primary-foreground'
              : 'text-foreground-muted hover:text-foreground'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentFace === face.id && (
            <motion.div
              layoutId="activeFace"
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: face.color }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{face.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
