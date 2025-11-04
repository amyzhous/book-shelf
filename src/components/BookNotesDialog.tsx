import { useState, useEffect } from 'react';
import { Book, Note } from '../App';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';

interface BookNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onUpdateNotes: (bookId: string, notes: Note[]) => void;
}

export function BookNotesDialog({ open, onOpenChange, book, onUpdateNotes }: BookNotesDialogProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [chapterNumber, setChapterNumber] = useState(1);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (book) {
      setNotes(book.notes);
    }
  }, [book]);

  const handleAddNote = () => {
    if (!book || !content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      chapterNumber,
      content,
    };

    const updatedNotes = [...notes, newNote].sort((a, b) => a.chapterNumber - b.chapterNumber);
    setNotes(updatedNotes);
    onUpdateNotes(book.id, updatedNotes);

    // Reset form
    setContent('');
    setChapterNumber(Math.max(...updatedNotes.map(n => n.chapterNumber), 0) + 1);
    setIsAddingNote(false);
  };

  const handleEditNote = () => {
    if (!book || !editingNote || !content.trim()) return;

    const updatedNotes = notes.map(note =>
      note.id === editingNote.id
        ? { ...note, chapterNumber, content }
        : note
    ).sort((a, b) => a.chapterNumber - b.chapterNumber);

    setNotes(updatedNotes);
    onUpdateNotes(book.id, updatedNotes);

    // Reset form
    setEditingNote(null);
    setContent('');
    setChapterNumber(1);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!book) return;

    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    onUpdateNotes(book.id, updatedNotes);
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setChapterNumber(note.chapterNumber);
    setContent(note.content);
    setIsAddingNote(false);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setIsAddingNote(false);
    setContent('');
    setChapterNumber(1);
  };

  const startAddNote = () => {
    setIsAddingNote(true);
    setEditingNote(null);
    setContent('');
    setChapterNumber(notes.length > 0 ? Math.max(...notes.map(n => n.chapterNumber)) + 1 : 1);
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 text-white p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with book info */}
          <DialogHeader className="p-6 pb-4 border-b border-white/10">
            <div className="flex gap-4">
              <img
                src={book.thumbnailUrl}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg border border-white/20"
              />
              <div className="flex-1">
                <DialogTitle className="text-white text-2xl mb-2">{book.title}</DialogTitle>
                <DialogDescription className="text-white/60 mb-2">
                  Manage your chapter notes and track your reading progress
                </DialogDescription>
                <Badge className="bg-blue-500/80 text-white border-blue-300/30">
                  {book.status}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 h-[calc(85vh-200px)]">
            {/* Notes List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white/80">Chapter Notes</h3>
                <Button
                  size="sm"
                  onClick={startAddNote}
                  disabled={isAddingNote || editingNote !== null}
                  className="bg-white/10 hover:bg-white/20 border-white/20"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Note
                </Button>
              </div>

              <ScrollArea className="h-[calc(85vh-290px)]">
                <div className="space-y-2 pr-4">
                  <AnimatePresence>
                    {notes.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-white/40 py-8"
                      >
                        No notes yet. Add your first chapter note!
                      </motion.div>
                    ) : (
                      notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors ${
                            editingNote?.id === note.id ? 'ring-2 ring-purple-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-purple-400">
                              Chapter {note.chapterNumber}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 hover:bg-white/20"
                                onClick={() => startEdit(note)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 hover:bg-red-500/20"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-white/70 text-sm whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>

            {/* Add/Edit Note Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
              {isAddingNote || editingNote ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-white/80">
                    {editingNote ? 'Edit Note' : 'Add New Note'}
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="chapter">Chapter Number</Label>
                    <Input
                      id="chapter"
                      type="number"
                      min="1"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Notes</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your chapter notes here..."
                      rows={10}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={editingNote ? handleEditNote : handleAddNote}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingNote ? 'Save Changes' : 'Add Note'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full text-white/40 text-center">
                  Select a note to edit or add a new one
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
