import { useState, useEffect } from 'react';
import { BookCard } from './components/BookCard';
import { AddBookDialog } from './components/AddBookDialog';
import { BookNotesDialog } from './components/BookNotesDialog';
import { EmptyState } from './components/EmptyState';
import { Button } from './components/ui/button';
import { Plus, Sun, Moon } from 'lucide-react';

export interface Note {
  id: string;
  chapterNumber: number;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  thumbnailUrl: string;
  status: 'Reading' | 'Up Next' | 'Done';
  rating: number;
  notes: Note[];
}

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleAddBook = (book: Omit<Book, 'id' | 'notes'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      notes: [],
    };
    setBooks([...books, newBook]);
  };

  const handleEditBook = (book: Omit<Book, 'id' | 'notes'>) => {
    if (editingBook) {
      setBooks(books.map(b => 
        b.id === editingBook.id 
          ? { ...b, ...book }
          : b
      ));
      setEditingBook(null);
    }
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
  };

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
    setIsNotesDialogOpen(true);
  };

  const handleUpdateNotes = (bookId: string, notes: Note[]) => {
    setBooks(books.map(b => 
      b.id === bookId 
        ? { ...b, notes }
        : b
    ));
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 bg-white dark:bg-gray-950 transition-colors duration-500">
        {/* Moving gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-70 dark:opacity-30 filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-70 dark:opacity-30 filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-70 dark:opacity-30 filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-70 dark:opacity-30 filter blur-3xl animate-blob animation-delay-6000"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-end gap-3 mb-8">
            <Button
              onClick={() => setIsDark(!isDark)}
              size="icon"
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-lg"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              onClick={() => {
                setEditingBook(null);
                setIsAddDialogOpen(true);
              }}
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Book
            </Button>
          </div>

          {/* Books Grid */}
          {books.length === 0 ? (
            <EmptyState onAddClick={() => setIsAddDialogOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpen={handleOpenBook}
                  onDelete={handleDeleteBook}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddBookDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={editingBook ? handleEditBook : handleAddBook}
        editingBook={editingBook}
      />

      <BookNotesDialog
        open={isNotesDialogOpen}
        onOpenChange={setIsNotesDialogOpen}
        book={selectedBook}
        onUpdateNotes={handleUpdateNotes}
      />
    </div>
  );
}
