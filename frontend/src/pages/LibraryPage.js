import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { FolderOpen, Trash2, Video, BookOpen, Mic, FileText, TrendingUp, LayoutGrid, Clock } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LibraryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { getAuthHeader } = useAuth();

  const typeIcons = {
    clips: Video,
    story: BookOpen,
    voiceover: Mic,
    transcription: FileText,
    ranking: TrendingUp,
    split_screen: LayoutGrid
  };

  const typeLabels = {
    clips: 'Clip',
    story: 'Story',
    voiceover: 'Voiceover',
    transcription: 'Transcription',
    ranking: 'Ranking',
    split_screen: 'Split Screen'
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const response = await axios.get(`${API}/library`, {
        headers: getAuthHeader()
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await axios.delete(`${API}/library/${id}`, {
        headers: getAuthHeader()
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#FF5F1F] mb-2">
              <FolderOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Library</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Your Content</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#FF5F1F] text-black'
                : 'bg-[#0A0A0A] text-[#A1A1AA] border border-[#27272A] hover:border-[#FF5F1F]/50'
            }`}
            data-testid="filter-all"
          >
            All
          </button>
          {Object.entries(typeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === key
                  ? 'bg-[#FF5F1F] text-black'
                  : 'bg-[#0A0A0A] text-[#A1A1AA] border border-[#27272A] hover:border-[#FF5F1F]/50'
              }`}
              data-testid={`filter-${key}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#27272A] border-t-[#FF5F1F] rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-[#27272A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
            <p className="text-[#A1A1AA] mb-6">
              {filter === 'all' 
                ? 'Start creating to build your library'
                : `No ${typeLabels[filter]} content found`}
            </p>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-[#FF5F1F] text-black font-bold hover:bg-[#FF7A45]"
              data-testid="create-content"
            >
              Create Content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => {
              const Icon = typeIcons[item.type] || FileText;
              return (
                <div
                  key={item.id}
                  className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 hover:border-[#FF5F1F]/30 transition-colors"
                  data-testid={`library-item-${item.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-[#FF5F1F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-[#27272A] text-[#A1A1AA] text-xs rounded mb-2">
                            {typeLabels[item.type] || item.type}
                          </span>
                          <h3 className="text-white font-medium mb-1 truncate">{item.title}</h3>
                          <div className="flex items-center gap-2 text-[#52525B] text-sm">
                            <Clock className="w-4 h-4" />
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-[#52525B] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          data-testid={`delete-${item.id}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-4 p-4 bg-[#050505] rounded-lg max-h-40 overflow-y-auto">
                        <pre className="text-[#A1A1AA] text-sm whitespace-pre-wrap font-mono">
                          {item.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LibraryPage;
