import { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { 
  Video, 
  Sparkles, 
  Copy, 
  Check, 
  Upload, 
  X, 
  Download,
  Play,
  Smartphone,
  Monitor,
  Clock,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ClipsPage = () => {
  // Upload state
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Generation options
  const [aiNotes, setAiNotes] = useState('');
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [targetDuration, setTargetDuration] = useState(60);
  
  // Result state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const { getAuthHeader } = useAuth();

  const durations = [
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 45, label: '45s' },
    { value: 60, label: '60s' },
    { value: 90, label: '90s' },
    { value: 180, label: '180s' }
  ];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload MP4, MOV, AVI, or WebM');
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    setUploadError('');
    setUploading(true);
    setResult(null);
    
    // Get video duration from preview
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (duration > 180) {
        setUploadError(`Video is too long (${formatDuration(duration)}). Maximum allowed is 3 minutes.`);
        setUploading(false);
        URL.revokeObjectURL(previewUrl);
        setVideoPreview(null);
        return;
      }
      setVideoDuration(duration);
    };
    video.src = previewUrl;
    
    // Upload to server
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API}/upload/video`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadedVideo(response.data);
      setVideoDuration(response.data.duration);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to upload video';
      setUploadError(errorMsg);
      URL.revokeObjectURL(previewUrl);
      setVideoPreview(null);
    } finally {
      setUploading(false);
    }
  }, [getAuthHeader]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-[#FF5F1F]');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add('border-[#FF5F1F]');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-[#FF5F1F]');
  }, []);

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setUploadedVideo(null);
    setVideoDuration(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!uploadedVideo) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('video_id', uploadedVideo.id);
      formData.append('video_filename', uploadedVideo.filename);
      formData.append('ai_notes', aiNotes);
      formData.append('aspect_ratio', aspectRatio);
      formData.append('target_duration', targetDuration.toString());
      
      const response = await axios.post(`${API}/generate/video-clip`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate clip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.captions) {
      navigator.clipboard.writeText(result.captions);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadVideo = () => {
    if (result?.output_url) {
      const link = document.createElement('a');
      link.href = `${process.env.REACT_APP_BACKEND_URL}${result.output_url}`;
      link.download = 'viral_clip.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#FF5F1F] mb-2">
            <Video className="w-5 h-5" />
            <span className="text-sm font-medium">Generate Clips</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Viral Video Clips</h1>
          <p className="text-[#A1A1AA]">
            Upload your video and let AI transform it into viral short-form content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Video Upload */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Upload Video</h2>
              
              {!videoPreview ? (
                <div
                  ref={dropZoneRef}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className="border-2 border-dashed border-[#27272A] rounded-xl p-8 text-center cursor-pointer hover:border-[#FF5F1F]/50 transition-colors"
                  data-testid="video-dropzone"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    className="hidden"
                    data-testid="video-input"
                  />
                  <Upload className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">
                    Drag & drop your video here
                  </p>
                  <p className="text-[#A1A1AA] text-sm mb-4">
                    or click to browse
                  </p>
                  <p className="text-[#52525B] text-xs">
                    MP4, MOV, AVI, WebM • Max 3 minutes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-full object-contain"
                      data-testid="video-preview"
                    />
                    <button
                      onClick={removeVideo}
                      className="absolute top-2 right-2 p-2 bg-black/70 rounded-full hover:bg-red-500/80 transition-colors"
                      data-testid="remove-video"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  {videoDuration && (
                    <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Duration: {formatDuration(videoDuration)}</span>
                    </div>
                  )}
                </div>
              )}
              
              {uploading && (
                <div className="mt-4 flex items-center gap-2 text-[#FF5F1F]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </div>
              )}
              
              {uploadError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {uploadError}
                </div>
              )}
            </div>

            {/* AI Notes */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-2">AI Notes (optional)</h2>
              <p className="text-[#52525B] text-sm mb-4">
                Describe the style you want for your clip
              </p>
              <Textarea
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                placeholder='e.g., "Make it emotional", "Fast TikTok style", "Cut boring parts"'
                rows={3}
                className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F] resize-none"
                data-testid="ai-notes"
              />
              <p className="text-[#52525B] text-xs mt-2">
                If empty, AI applies default viral logic
              </p>
            </div>

            {/* Video Format */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Video Format</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAspectRatio('portrait')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    aspectRatio === 'portrait'
                      ? 'border-[#FF5F1F] bg-[#FF5F1F]/10'
                      : 'border-[#27272A] hover:border-[#FF5F1F]/50'
                  }`}
                  data-testid="format-portrait"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-14 border-2 border-current rounded-md flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <p className={`font-medium ${aspectRatio === 'portrait' ? 'text-[#FF5F1F]' : 'text-white'}`}>
                        Portrait
                      </p>
                      <p className="text-[#52525B] text-xs">9:16</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setAspectRatio('landscape')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    aspectRatio === 'landscape'
                      ? 'border-[#FF5F1F] bg-[#FF5F1F]/10'
                      : 'border-[#27272A] hover:border-[#FF5F1F]/50'
                  }`}
                  data-testid="format-landscape"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-8 border-2 border-current rounded-md flex items-center justify-center">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <p className={`font-medium ${aspectRatio === 'landscape' ? 'text-[#FF5F1F]' : 'text-white'}`}>
                        Landscape
                      </p>
                      <p className="text-[#52525B] text-xs">16:9</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Final Video Length */}
            <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Final Video Length</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {durations.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setTargetDuration(d.value)}
                    disabled={videoDuration && d.value > videoDuration}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      targetDuration === d.value
                        ? 'bg-[#FF5F1F] text-black'
                        : videoDuration && d.value > videoDuration
                        ? 'bg-[#121212] text-[#52525B] cursor-not-allowed opacity-50'
                        : 'bg-[#121212] text-[#A1A1AA] border border-[#27272A] hover:border-[#FF5F1F]/50'
                    }`}
                    data-testid={`duration-${d.value}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-[#52525B] text-xs mt-3">
                AI will detect the most viral moments and optimize pacing
              </p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !uploadedVideo}
              className="w-full bg-[#FF5F1F] text-black font-bold py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_15px_rgba(255,95,31,0.4)] disabled:opacity-50"
              data-testid="generate-clip"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Viral Clip...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Viral Clip
                </>
              )}
            </Button>
          </div>

          {/* Output Panel */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Output</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-2 border-[#27272A] border-t-[#FF5F1F] rounded-full animate-spin mb-4" />
                <p className="text-white font-medium mb-2">Creating your viral clip...</p>
                <p className="text-[#52525B] text-sm text-center">
                  AI is analyzing, cutting, and optimizing your video
                </p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Video Preview */}
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  <video
                    src={`${process.env.REACT_APP_BACKEND_URL}${result.output_url}`}
                    controls
                    className="w-full h-full object-contain"
                    data-testid="output-video"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={downloadVideo}
                    className="flex-1 bg-[#FF5F1F] text-black font-bold hover:bg-[#FF7A45]"
                    data-testid="download-video"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="border-[#27272A] text-white hover:bg-white/5"
                    data-testid="copy-captions"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Caption'}
                  </Button>
                </div>

                {/* Captions */}
                <div>
                  <h3 className="text-sm font-medium text-[#A1A1AA] mb-2">Generated Caption</h3>
                  <div className="bg-[#050505] rounded-lg p-4">
                    <pre className="text-white text-sm whitespace-pre-wrap">
                      {result.captions}
                    </pre>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-4 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 rounded-lg">
                  <p className="text-[#FF5F1F] text-sm">
                    {result.ai_summary || "This clip was optimized for engagement using hook-first cuts and dynamic pacing."}
                  </p>
                </div>

                {/* Duration Info */}
                {result.duration && (
                  <div className="flex items-center gap-2 text-[#52525B] text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Final duration: {formatDuration(result.duration)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-[#121212] rounded-2xl flex items-center justify-center mb-6">
                  <Play className="w-10 h-10 text-[#27272A]" />
                </div>
                <p className="text-[#A1A1AA] mb-2">Your viral clip will appear here</p>
                <p className="text-[#52525B] text-sm max-w-xs">
                  Upload a video, customize your preferences, and click generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClipsPage;
