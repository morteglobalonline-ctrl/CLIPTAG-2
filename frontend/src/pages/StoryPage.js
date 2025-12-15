import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { 
  BookOpen, 
  Sparkles, 
  Download,
  Play,
  Loader2,
  Zap,
  Heart,
  Eye,
  AlertTriangle,
  GraduationCap,
  Gamepad2,
  Car,
  ChefHat,
  Sparkle,
  Blocks,
  PersonStanding,
  Check
} from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StoryPage = () => {
  // Step 1: Story Transcript
  const [transcript, setTranscript] = useState('');
  
  // Step 2: Story Style
  const [style, setStyle] = useState('dramatic');
  
  // Step 3: Story Length
  const [storyLength, setStoryLength] = useState('medium');
  
  // Step 4: Background Video
  const [background, setBackground] = useState('minecraft');
  
  // Generation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const { getAuthHeader } = useAuth();

  // Story Styles with icons and descriptions
  const storyStyles = [
    { id: 'dramatic', label: 'Dramatic', icon: Zap, description: 'Bold, intense pacing' },
    { id: 'mysterious', label: 'Mysterious', icon: Eye, description: 'Slow reveals, tension' },
    { id: 'heartwarming', label: 'Heartwarming', icon: Heart, description: 'Emotional, touching' },
    { id: 'suspenseful', label: 'Suspenseful', icon: AlertTriangle, description: 'Edge-of-seat tension' },
    { id: 'educational', label: 'Educational', icon: GraduationCap, description: 'Clear, informative' }
  ];

  // Story Lengths (NO seconds/time values)
  const storyLengths = [
    { id: 'short', label: 'Short', description: 'Fast pacing, maximum retention' },
    { id: 'medium', label: 'Medium', description: 'Balanced storytelling' },
    { id: 'long', label: 'Long', description: 'Deeper emotional build' }
  ];

  // Predefined viral background videos
  const backgroundVideos = [
    { 
      id: 'minecraft', 
      label: 'Minecraft Parkour', 
      icon: Blocks,
      preview: 'https://images.unsplash.com/photo-1627856014754-2907e2355be5?w=400&h=700&fit=crop',
      color: '#4ADE80'
    },
    { 
      id: 'roblox', 
      label: 'Roblox Gameplay', 
      icon: Gamepad2,
      preview: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=700&fit=crop',
      color: '#EF4444'
    },
    { 
      id: 'subway', 
      label: 'Subway Runner', 
      icon: PersonStanding,
      preview: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=700&fit=crop',
      color: '#FBBF24'
    },
    { 
      id: 'satisfying', 
      label: 'Satisfying Loops', 
      icon: Sparkle,
      preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=700&fit=crop',
      color: '#A78BFA'
    },
    { 
      id: 'cooking', 
      label: 'ASMR Cooking', 
      icon: ChefHat,
      preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=700&fit=crop',
      color: '#FB923C'
    },
    { 
      id: 'driving', 
      label: 'GTA City Cruise', 
      icon: Car,
      preview: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=700&fit=crop',
      color: '#38BDF8'
    }
  ];

  const isFormValid = transcript.trim().length > 0;

  const handleGenerate = async () => {
    if (!isFormValid) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API}/generate/story-video`, {
        transcript,
        style,
        story_length: storyLength,
        background
      }, {
        headers: getAuthHeader()
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate story video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = () => {
    if (result?.output_url) {
      const link = document.createElement('a');
      link.href = `${process.env.REACT_APP_BACKEND_URL}${result.output_url}`;
      link.download = 'story_video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#FF5F1F] mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Story Videos</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Viral Story Videos</h1>
          <p className="text-[#A1A1AA]">
            Turn your story into a high-retention faceless video for TikTok, Reels & Shorts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Form - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* STEP 1: Story Transcript */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Story Transcript</h2>
                  <p className="text-[#52525B] text-sm">Write your story exactly as you want it told</p>
                </div>
              </div>
              
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Write your story here... This text will appear as on-screen captions exactly as you write it."
                rows={8}
                className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F] resize-none text-base leading-relaxed"
                data-testid="story-transcript"
              />
              <div className="flex justify-between mt-2">
                <p className="text-[#52525B] text-xs">
                  This will be displayed as animated captions
                </p>
                <p className="text-[#52525B] text-xs">
                  {transcript.length} characters
                </p>
              </div>
            </div>

            {/* STEP 2: Story Style */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Story Style</h2>
                  <p className="text-[#52525B] text-sm">Choose the mood and pacing</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {storyStyles.map((s) => {
                  const Icon = s.icon;
                  const isSelected = style === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-[#FF5F1F] bg-[#FF5F1F]/10'
                          : 'border-[#27272A] hover:border-[#FF5F1F]/50 bg-[#121212]'
                      }`}
                      data-testid={`style-${s.id}`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-[#FF5F1F]' : 'text-[#A1A1AA]'}`} />
                      <p className={`text-sm font-medium ${isSelected ? 'text-[#FF5F1F]' : 'text-white'}`}>
                        {s.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Story Length */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Story Length</h2>
                  <p className="text-[#52525B] text-sm">AI adapts pacing automatically</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {storyLengths.map((l) => {
                  const isSelected = storyLength === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setStoryLength(l.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-[#FF5F1F] bg-[#FF5F1F]/10'
                          : 'border-[#27272A] hover:border-[#FF5F1F]/50 bg-[#121212]'
                      }`}
                      data-testid={`length-${l.id}`}
                    >
                      <p className={`text-lg font-semibold mb-1 ${isSelected ? 'text-[#FF5F1F]' : 'text-white'}`}>
                        {l.label}
                      </p>
                      <p className="text-[#52525B] text-xs">
                        {l.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: Background Video */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                  4
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Viral Background Video</h2>
                  <p className="text-[#52525B] text-sm">Select a high-retention background</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {backgroundVideos.map((bg) => {
                  const Icon = bg.icon;
                  const isSelected = background === bg.id;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => setBackground(bg.id)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-[9/12] group ${
                        isSelected
                          ? 'border-[#FF5F1F] ring-2 ring-[#FF5F1F]/30'
                          : 'border-[#27272A] hover:border-[#FF5F1F]/50'
                      }`}
                      data-testid={`background-${bg.id}`}
                    >
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${bg.preview})` }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                            isSelected ? 'bg-[#FF5F1F]' : 'bg-black/50'
                          }`}
                          style={{ backgroundColor: isSelected ? '#FF5F1F' : `${bg.color}30` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: isSelected ? 'black' : bg.color }} />
                        </div>
                        <p className={`text-sm font-medium text-center ${isSelected ? 'text-[#FF5F1F]' : 'text-white'}`}>
                          {bg.label}
                        </p>
                      </div>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#FF5F1F] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !isFormValid}
              className="w-full bg-[#FF5F1F] text-black font-bold py-6 text-lg hover:bg-[#FF7A45] hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] disabled:opacity-50"
              data-testid="generate-story"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Your Story Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Story Video
                </>
              )}
            </Button>
          </div>

          {/* Output Panel - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-6">Output</h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-2 border-[#27272A] rounded-full" />
                    <div className="absolute inset-0 border-2 border-[#FF5F1F] border-t-transparent rounded-full animate-spin" />
                    <BookOpen className="absolute inset-0 m-auto w-8 h-8 text-[#FF5F1F]" />
                  </div>
                  <p className="text-white font-medium mb-2">Creating your story video...</p>
                  <p className="text-[#52525B] text-sm text-center max-w-xs">
                    Syncing captions, applying style, and optimizing for retention
                  </p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Video Preview */}
                  <div className="rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-[400px] mx-auto">
                    {result.output_url ? (
                      <video
                        src={`${process.env.REACT_APP_BACKEND_URL}${result.output_url}`}
                        controls
                        className="w-full h-full object-contain"
                        data-testid="output-video"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#121212]">
                        <div className="text-center p-6">
                          <BookOpen className="w-12 h-12 text-[#FF5F1F] mx-auto mb-3" />
                          <p className="text-white font-medium mb-2">Story Generated!</p>
                          <p className="text-[#52525B] text-sm">Preview your captions below</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  {result.output_url && (
                    <Button
                      onClick={downloadVideo}
                      className="w-full bg-[#FF5F1F] text-black font-bold hover:bg-[#FF7A45]"
                      data-testid="download-video"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                  )}

                  {/* Caption Preview */}
                  {result.captions && (
                    <div>
                      <h3 className="text-sm font-medium text-[#A1A1AA] mb-2">Captions Preview</h3>
                      <div className="bg-[#050505] rounded-lg p-4 max-h-48 overflow-y-auto">
                        <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                          {result.captions}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-4 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 rounded-lg">
                    <p className="text-[#FF5F1F] text-sm">
                      Optimized for viral reach with animated captions and high-retention pacing.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-[#121212] rounded-2xl flex items-center justify-center mb-6">
                    <Play className="w-10 h-10 text-[#27272A]" />
                  </div>
                  <p className="text-[#A1A1AA] mb-2">Your story video will appear here</p>
                  <p className="text-[#52525B] text-sm max-w-xs">
                    Write your transcript, pick a style, and choose a viral background
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoryPage;
