import { Book } from '../App';
import { Star, Trash2, Edit } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookCardProps {
  book: Book;
  onOpen: (book: Book) => void;
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
}

export function BookCard({ book, onOpen, onDelete, onEdit }: BookCardProps) {
  const statusColors = {
    'Reading': 'bg-blue-500/80 text-white border-blue-300/30',
    'Up Next': 'bg-yellow-500/80 text-white border-yellow-300/30',
    'Done': 'bg-green-500/80 text-white border-green-300/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="group relative cursor-pointer"
      onClick={() => onOpen(book)}
    >
      {/* Liquid glass card */}
      <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/20 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/50">
        {/* Book thumbnail */}
        <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
          <ImageWithFallback
            src={book.thumbnailUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(book);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-red-500/20 hover:bg-red-500/40 text-white backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(book.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Book info */}
        <div className="p-4 space-y-2">
          <h3 className="text-gray-900 dark:text-white line-clamp-2 min-h-[3em] font-medium">{book.title}</h3>

          <div className="flex items-center justify-between">
            <Badge className={statusColors[book.status]}>
              {book.status}
            </Badge>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < book.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Notes count */}
          {book.notes.length > 0 && (
            <div className="text-gray-600 dark:text-white/60 text-sm">
              {book.notes.length} chapter note{book.notes.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
