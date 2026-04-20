import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Globe,
  Music
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { cn } from '@/shared/lib/utils';

interface Artist {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  genre: string;
}

const MOCK_ARTISTS: Artist[] = [
  { id: '1', name: 'The Midnight', country: 'USA', imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee243870eb2?w=400&q=80', genre: 'Synthwave' },
  { id: '2', name: 'Gunship', country: 'UK', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', genre: 'Darksynth' },
  { id: '3', name: 'Perturbator', country: 'France', imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80', genre: 'Electro' },
];

export default function ArtistManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  
  // Form State
  const [newArtist, setNewArtist] = useState({
    name: '',
    country: '',
    genre: '',
    imageUrl: ''
  });

  const handleAddArtist = () => {
    if (!newArtist.name) return;
    
    const artist: Artist = {
      id: Math.random().toString(36).substr(2, 9),
      ...newArtist
    };
    
    setArtists([artist, ...artists]);
    setShowForm(false);
    setNewArtist({ name: '', country: '', genre: '', imageUrl: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Artists Catalog</h1>
          <p className="text-muted-foreground">Manage the creators and musical icons of your collection.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Artist
        </Button>
      </div>

      {showForm && (
        <Card className="bg-surface border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
            <CardTitle className="text-xl font-bold text-foreground">Register New Artist</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Artist Representative Photo</label>
                <ImageUpload 
                  value={newArtist.imageUrl} 
                  onChange={(url) => setNewArtist({ ...newArtist, imageUrl: url })}
                  onRemove={() => setNewArtist({ ...newArtist, imageUrl: '' })}
                  label="Drop artist photo here"
                />
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Daft Punk"
                    className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                    value={newArtist.name}
                    onChange={(e) => setNewArtist({...newArtist, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Country</label>
                    <input 
                      type="text" 
                      placeholder="e.g. France"
                      className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                      value={newArtist.country}
                      onChange={(e) => setNewArtist({...newArtist, country: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Main Genre</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Electronic"
                      className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                      value={newArtist.genre}
                      onChange={(e) => setNewArtist({...newArtist, genre: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="flex-[2] h-12 rounded-xl bg-primary text-white" onClick={handleAddArtist}>Save Artist Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <input 
            type="text" 
            placeholder="Search artists by name or country..."
            className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-surface border-border">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      {/* Artist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <Card key={artist.id} className="bg-surface border-border overflow-hidden hover:shadow-xl transition-all group">
            <div className="aspect-[4/3] w-full relative overflow-hidden">
               <img 
                src={artist.imageUrl} 
                alt={artist.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary/20 backdrop-blur-md border border-primary/20 rounded text-[10px] font-black uppercase tracking-tighter text-primary">
                      {artist.genre}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{artist.name}</h3>
               </div>
            </div>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Globe className="h-4 w-4" />
                {artist.country}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
