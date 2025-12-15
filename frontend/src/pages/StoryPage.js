import { useState, useEffect } from 'react';
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
  Check,
  AlertCircle
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
  const [backgrounds, setBackgrounds] = useState([]);
  const [backgroundsLoading, setBackgroundsLoading] = useState(true);
  const [backgroundError, setBackgroundError] = useState('');
  
  // Generation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  
  const { getAuthHeader } = useAuth();

  // Fetch available backgrounds on mount
  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    setBackgroundsLoading(true);
    setBackgroundError('');
    try {
      const response = await axios.get(`${API}/backgrounds`);
      setBackgrounds(response.data);
      // Set default background if available
      if (response.data.length > 0 && response.data[0].video_count > 0) {
        setBackground(response.data[0].id);
      }
    } catch (err) {
      setBackgroundError('Failed to load background videos');
      console.error('Error fetching backgrounds:', err);
    } finally {
      setBackgroundsLoading(false);
    }
  };

  // Story Styles with icons and descriptions
  const storyStyles = [
    { id: 'dramatic', label: 'Dramatic', icon: Zap },
    { id: 'mysterious', label: 'Mysterious', icon: Eye },
    { id: 'heartwarming', label: 'Warm', icon: Heart },
    { id: 'suspenseful', label: 'Suspense', icon: AlertTriangle },
    { id: 'educational', label: 'Educate', icon: GraduationCap }
  ];

  // Story Lengths (NO seconds/time values)
  const storyLengths = [
    { id: 'short', label: 'Short', description: 'Fast pacing' },
    { id: 'medium', label: 'Medium', description: 'Balanced' },
    { id: 'long', label: 'Long', description: 'Deep build' }
  ];

  // Background icons mapping
  const backgroundIcons = {
    minecraft: Blocks,
    roblox: Gamepad2,
    subway: PersonStanding,
    satisfying: Sparkle,
    cooking: ChefHat,
    driving: Car
  };

  // Background colors
  const backgroundColors = {
    minecraft: '#4ADE80',
    roblox: '#EF4444',
    subway: '#FBBF24',
    satisfying: '#A78BFA',
    cooking: '#FB923C',
    driving: '#38BDF8'
  };

  const isFormValid = transcript.trim().length > 0;
  const selectedBg = backgrounds.find(bg => bg.id === background);
  const hasValidBackground = selectedBg && selectedBg.video_count > 0;

  const handleGenerate = async () => {
    if (!isFormValid || !hasValidBackground) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    setProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      const response = await axios.post(`${API}/generate/story-video`, {
        transcript,
        style,
        story_length: storyLength,
        background
      }, {
        headers: getAuthHeader()
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to generate story video. Please try again.';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
      setProgress(0);
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
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">Story Transcript</h2>
                  <p className="text-[#52525B] text-sm truncate">Write your story exactly as you want it told</p>
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

            {/* STEP 2: Story Style - FIXED OVERFLOW */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">Story Style</h2>
                  <p className="text-[#52525B] text-sm truncate">Choose the mood and pacing</p>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {storyStyles.map((s) => {
                  const Icon = s.icon;
                  const isSelected = style === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-3 rounded-xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? 'border-[#FF5F1F] bg-[#FF5F1F]/10'
                          : 'border-[#27272A] hover:border-[#FF5F1F]/50 bg-[#121212]'
                      }`}
                      data-testid={`style-${s.id}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-[#FF5F1F]' : 'text-[#A1A1AA]'}`} />
                        <span 
                          className={`text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                            isSelected ? 'text-[#FF5F1F]' : 'text-white'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Story Length */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">Story Length</h2>
                  <p className="text-[#52525B] text-sm truncate">AI adapts pacing automatically</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {storyLengths.map((l) => {
                  const isSelected = storyLength === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setStoryLength(l.id)}
                      className={`p-4 rounded-xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? 'border-[#FF5F1F] bg-[#FF5F1F]/10'
                          : 'border-[#27272A] hover:border-[#FF5F1F]/50 bg-[#121212]'
                      }`}
                      data-testid={`length-${l.id}`}
                    >
                      <p className={`text-base font-semibold mb-1 whitespace-nowrap overflow-hidden text-ellipsis ${
                        isSelected ? 'text-[#FF5F1F]' : 'text-white'
                      }`}>
                        {l.label}
                      </p>
                      <p className="text-[#52525B] text-xs whitespace-nowrap overflow-hidden text-ellipsis">
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
                <div className="w-8 h-8 bg-[#FF5F1F] rounded-lg flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  4
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">Viral Background Video</h2>
                  <p className="text-[#52525B] text-sm truncate">Select a high-retention background</p>
                </div>
              </div>
              
              {backgroundsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#FF5F1F] animate-spin" />
                  <span className="ml-2 text-[#A1A1AA]">Loading backgrounds...</span>
                </div>
              ) : backgroundError ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{backgroundError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {backgrounds.map((bg) => {
                    const Icon = backgroundIcons[bg.id] || Sparkle;
                    const color = backgroundColors[bg.id] || '#FF5F1F';
                    const isSelected = background === bg.id;
                    const hasVideos = bg.video_count > 0;
                    
                    return (
                      <button
                        key={bg.id}
                        onClick={() => hasVideos && setBackground(bg.id)}
                        disabled={!hasVideos}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-[9/12] group ${
                          !hasVideos
                            ? 'border-[#27272A] opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#FF5F1F] ring-2 ring-[#FF5F1F]/30'
                            : 'border-[#27272A] hover:border-[#FF5F1F]/50'
                        }`}
                        data-testid={`background-${bg.id}`}
                      >
                        {/* Background Color */}
                        <div 
                          className="absolute inset-0"
                          style={{ backgroundColor: `${color}20` }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end p-3">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                              isSelected ? 'bg-[#FF5F1F]' : 'bg-black/50'
                            }`}
                            style={{ backgroundColor: isSelected ? '#FF5F1F' : `${color}30` }}
                          >
                            <Icon 
                              className="w-5 h-5" 
                              style={{ color: isSelected ? 'black' : color }} 
                            />
                          </div>
                          <p className={`text-xs font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-1 ${
                            isSelected ? 'text-[#FF5F1F]' : 'text-white'
                          }`}>
                            {bg.label}
                          </p>
                          {!hasVideos && (
                            <p className="text-[#EF4444] text-[10px] mt-1">No videos</p>
                          )}
                        </div>
                        
                        {/* Selection Indicator */}
                        {isSelected && hasVideos && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#FF5F1F] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !isFormValid || !hasValidBackground}
              className="w-full bg-[#FF5F1F] text-black font-bold py-6 text-lg hover:bg-[#FF7A45] hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="generate-story"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Your Story Video... {progress > 0 && `${progress}%`}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Story Video
                </>
              )}
            </Button>
            
            {!hasValidBackground && !backgroundsLoading && (
              <p className="text-center text-[#EF4444] text-sm">
                Please select a background category with available videos
              </p>
            )}
          </div>

          {/* Output Panel - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-6">Output</h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
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
                  {progress > 0 && (
                    <div className="w-full max-w-xs mt-4">
                      <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF5F1F] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
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
