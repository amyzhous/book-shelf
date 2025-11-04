import { Button } from './ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="relative bg-white/[0.08] backdrop-blur-2xl rounded-3xl border border-white/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-12 max-w-md text-center before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-50 before:pointer-events-none">
        <div className="relative z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="mb-6 inline-block"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <h2 className="text-white text-3xl mb-4">Your Shelf is Empty</h2>
        <p className="text-white/60 mb-8">
          Start building your digital library by adding your first book. Track your reading progress and keep notes for each chapter.
        </p>

        <Button
          onClick={onAddClick}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Your First Book
        </Button>
        </div>
      </div>
    </motion.div>
  );
}
