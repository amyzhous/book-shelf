import { useState, useEffect } from 'react';
import { Book } from '../App';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Star, Search } from 'lucide-react';

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Omit<Book, 'id' | 'notes'>) => void;
  editingBook?: Book | null;
}

export function AddBookDialog({ open, onOpenChange, onSave, editingBook }: AddBookDialogProps) {
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<'Reading' | 'Up Next' | 'Done'>('Up Next');
  const [rating, setRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setThumbnailUrl(editingBook.thumbnailUrl);
      setStatus(editingBook.status);
      setRating(editingBook.rating);
    } else {
      setTitle('');
      setThumbnailUrl('');
      setStatus('Up Next');
      setRating(0);
      setSearchQuery('');
    }
  }, [editingBook, open]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Mock search functionality - simulating book API search
      // In a real app, you would call Google Books API or similar
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=1`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        setTitle(book.title || '');
        setThumbnailUrl(book.imageLinks?.thumbnail?.replace('http:', 'https:') || '');
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !thumbnailUrl.trim()) return;

    onSave({
      title,
      thumbnailUrl,
      status,
      rating,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription className="text-white/60">
            {editingBook ? 'Update your book information below.' : 'Search for a book or enter the details manually.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Books */}
          {!editingBook && (
            <div className="space-y-2">
              <Label htmlFor="search">Search Books</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or author..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 border-white/20 size-9 rounded-md p-0 shrink-0"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Book Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Book Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL *</Label>
            <Input
              id="thumbnail"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/book-cover.jpg"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            {thumbnailUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="h-32 object-cover rounded-lg border border-white/20"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20 text-white">
                <SelectItem value="Reading">Reading</SelectItem>
                <SelectItem value="Up Next">Up Next</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              {editingBook ? 'Save Changes' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
