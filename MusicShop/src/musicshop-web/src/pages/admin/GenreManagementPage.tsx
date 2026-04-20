import { useState } from 'react';
import { 
  Hash, 
  Plus, 
  Search, 
  X,
  Edit2, 
  Trash2,
  Tag
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

interface Genre {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const MOCK_GENRES: Genre[] = [
  { id: '1', name: 'Synthwave', slug: 'synthwave', color: 'bg-pink-500' },
  { id: '2', name: 'Darksynth', slug: 'darksynth', color: 'bg-purple-600' },
  { id: '3', name: 'Electronic', slug: 'electronic', color: 'bg-blue-500' },
  { id: '4', name: 'Vaporwave', slug: 'vaporwave', color: 'bg-cyan-400' },
  { id: '5', name: 'Cyberpunk', slug: 'cyberpunk', color: 'bg-red-600' },
];

export default function GenreManagementPage() {
  const [genres, setGenres] = useState<Genre[]>(MOCK_GENRES);
  const [showForm, setShowForm] = useState(false);
  const [newGenre, setNewGenre] = useState({ name: '' });

  const handleAddGenre = () => {
    if (!newGenre.name) return;
    const colors = ['bg-pink-500', 'bg-purple-600', 'bg-blue-500', 'bg-cyan-400', 'bg-red-600', 'bg-amber-500', 'bg-emerald-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const genre: Genre = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGenre.name,
      slug: newGenre.name.toLowerCase().replace(/\s+/g, '-'),
      color: randomColor
    };
    
    setGenres([...genres, genre]);
    setNewGenre({ name: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Music Genres</h1>
          <p className="text-muted-foreground">Categorize your catalog with vibrant musical styles.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Genre
        </Button>
      </div>

      {showForm && (
        <Card className="bg-surface border-primary/20 shadow-2xl max-w-lg animate-in zoom-in-95 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              New Genre
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Genre Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dream Pop"
                autoFocus
                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                value={newGenre.name}
                onChange={(e) => setNewGenre({ name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGenre()}
              />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="flex-[2] h-12 rounded-xl bg-primary text-white" onClick={handleAddGenre}>Create Genre</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Card key={genre.id} className="bg-surface border-border hover:border-primary/30 transition-all group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shadow-inner", genre.color)}>
                  <Hash className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{genre.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{genre.slug}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
