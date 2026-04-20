import { useState } from 'react';
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2,
  ListMusic,
  Disc,
  Calendar,
  Building
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import ReleaseForm from '@/features/admin/components/ReleaseForm';

interface Release {
  id: string;
  title: string;
  artistName: string;
  labelName: string;
  year: number;
  type: string;
  coverUrl: string;
  versionsCount: number;
}

const MOCK_RELEASES: Release[] = [
  { 
    id: '1', 
    title: 'Endless Summer', 
    artistName: 'The Midnight', 
    labelName: 'Self Released', 
    year: 2016, 
    type: 'Album', 
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
    versionsCount: 2
  },
  { 
    id: '2', 
    title: 'Dark All Day', 
    artistName: 'Gunship', 
    labelName: 'Horsie In The Hedge', 
    year: 2018, 
    type: 'Album', 
    coverUrl: 'https://images.unsplash.com/photo-1514525253361-bee243870eb2?w=400&q=80',
    versionsCount: 3
  },
  { 
    id: '3', 
    title: 'Uncanny Valley', 
    artistName: 'Perturbator', 
    labelName: 'Blood Music', 
    year: 2016, 
    type: 'Album', 
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80',
    versionsCount: 1
  },
];

export default function ReleaseManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [releases, setReleases] = useState<Release[]>(MOCK_RELEASES);
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Releases & Inventory</h1>
          <p className="text-muted-foreground">Manage your musical catalog, tracklists, and physical stock.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Release
        </Button>
      </div>

      {showForm ? (
        <div className="animate-in zoom-in-95 duration-300">
           <ReleaseForm onCancel={() => setShowForm(false)} />
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input 
                type="text" 
                placeholder="Search releases, artists, or labels..."
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
               <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <Calendar className="h-4 w-4" />
                Year
              </Button>
            </div>
          </div>

          {/* Releases List */}
          <div className="grid grid-cols-1 gap-4">
            {releases.map((release) => (
              <Card key={release.id} className="bg-surface border-border overflow-hidden hover:shadow-md transition-all group p-0">
                <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                   {/* Cover Art */}
                   <div className="w-full md:w-32 aspect-square relative shrink-0">
                      <img 
                        src={release.coverUrl} 
                        alt={release.title} 
                        className="w-full h-full object-cover" 
                      />
                   </div>

                   {/* Information Cluster */}
                   <div className="flex-1 p-5 flex flex-col justify-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <h3 className="text-xl font-bold text-foreground leading-tight">{release.title}</h3>
                               <span className="px-2 py-0.5 bg-muted border border-border rounded text-[10px] font-bold text-muted-foreground uppercase">
                                 {release.type}
                               </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                               <span className="font-semibold text-primary">{release.artistName}</span>
                               <span className="text-subtle">•</span>
                               <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {release.labelName}
                               </span>
                               <span className="text-subtle">•</span>
                               <span>{release.year}</span>
                            </div>
                         </div>

                         {/* Quick Stats */}
                         <div className="flex items-center gap-6 pr-4">
                            <div className="text-center">
                               <p className="text-[10px] font-black uppercase text-subtle tracking-tighter">Inventory</p>
                               <div className="flex items-center gap-1.5 mt-0.5 text-foreground">
                                  <Disc className="h-4 w-4 text-primary" />
                                  <span className="font-bold">{release.versionsCount} Versions</span>
                               </div>
                            </div>
                            <div className="h-8 w-px bg-border hidden md:block" />
                            <div className="flex items-center gap-2">
                               <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary rounded-xl">
                                  <Edit2 className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-red-500 rounded-xl">
                                  <Trash2 className="h-4 w-4" />
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
