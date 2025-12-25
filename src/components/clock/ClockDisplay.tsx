import { WatchFaceType } from '@/types/clock';
import { WatchFaceLuxury } from './WatchFaceLuxury';
import { WatchFaceMinimal } from './WatchFaceMinimal';
import { WatchFaceDigital } from './WatchFaceDigital';
import { WatchFaceSporty } from './WatchFaceSporty';
import { WatchFaceNeon } from './WatchFaceNeon';
import { AnimatePresence, motion } from 'framer-motion';

interface ClockDisplayProps {
  face: WatchFaceType;
  size?: number;
  is24Hour?: boolean;
}

export function ClockDisplay({ face, size = 320, is24Hour = false }: ClockDisplayProps) {
  const renderFace = () => {
    switch (face) {
      case 'luxury':
        return <WatchFaceLuxury size={size} />;
      case 'minimal':
        return <WatchFaceMinimal size={size} />;
      case 'digital':
        return <WatchFaceDigital size={size} is24Hour={is24Hour} />;
      case 'sporty':
        return <WatchFaceSporty size={size} />;
      case 'neon':
        return <WatchFaceNeon size={size} />;
      default:
        return <WatchFaceLuxury size={size} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={face}
        initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateY: 15 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="relative"
      >
        {renderFace()}
      </motion.div>
    </AnimatePresence>
  );
}
