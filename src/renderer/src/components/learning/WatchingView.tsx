import React, { useState } from 'react';
import {
  Tv,
  Play,
  Pause,
  Volume2,
  BookmarkPlus,
  Sparkles,
  Search,
  ExternalLink,
  RotateCcw,
  Clock,
  Layers,
  ArrowRight,
  Check
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

interface SubtitleLine {
  id: number;
  timeSec: number;
  timeStr: string;
  en: string;
  tr: string;
  level: CEFRLevel;
  highlightWords: string[];
}

interface VideoLesson {
  id: string;
  title: string;
  channel: string;
  level: CEFRLevel;
  duration: string;
  youtubeId: string;
  thumbnail: string;
  category: string;
  subtitles: SubtitleLine[];
}

const CURATED_VIDEOS: VideoLesson[] = [
  {
    id: 'vid-1',
    title: 'How Artificial Intelligence is Changing Businesses',
    channel: 'BBC Learning English',
    level: 'B1',
    duration: '4:20',
    youtubeId: 'ad79nYk2keg',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    category: 'Teknoloji',
    subtitles: [
      {
        id: 1,
        timeSec: 12,
        timeStr: '0:12',
        en: 'Artificial intelligence is helping businesses improve their services and reduce costs.',
        tr: 'Yapay zekâ işletmelerin hizmetlerini geliştirmelerine ve maliyetleri azaltmalarına yardımcı oluyor.',
        level: 'B1',
        highlightWords: ['improve', 'reduce']
      },
      {
        id: 2,
        timeSec: 35,
        timeStr: '0:35',
        en: 'It has become crucial for modern companies to implement sustainable digital workflows.',
        tr: 'Modern şirketlerin sürdürülebilir dijital iş akışlarını hayata geçirmesi kritik önem kazandı.',
        level: 'B2',
        highlightWords: ['crucial', 'implement', 'sustainable']
      },
      {
        id: 3,
        timeSec: 68,
        timeStr: '1:08',
        en: 'Experts say these technological advancements provide a unique opportunity to collaborate globally.',
        tr: 'Uzmanlar bu teknolojik gelişmelerin küresel ölçekte iş birliği yapmak için benzersiz bir fırsat sunduğunu söylüyor.',
        level: 'B2',
        highlightWords: ['opportunity', 'collaborate']
      },
      {
        id: 4,
        timeSec: 110,
        timeStr: '1:50',
        en: 'Understanding these concepts is inevitable for anyone who wishes to comprehend modern software.',
        tr: 'Bu kavramları anlamak modern yazılımı kavramak isteyen herkes için kaçınılmazdır.',
        level: 'C1',
        highlightWords: ['inevitable', 'comprehend']
      }
    ]
  },
  {
    id: 'vid-2',
    title: 'The Future of Renewable and Sustainable Energy',
    channel: 'TED-Ed Science',
    level: 'B2',
    duration: '5:45',
    youtubeId: 'RnvCbquYeIM',
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    category: 'Bilim & Enerji',
    subtitles: [
      {
        id: 1,
        timeSec: 15,
        timeStr: '0:15',
        en: 'Solar and wind energy are crucial components of a sustainable future.',
        tr: 'Güneş ve rüzgâr enerjisi sürdürülebilir bir geleceğin hayati bileşenleridir.',
        level: 'B2',
        highlightWords: ['crucial', 'sustainable']
      },
      {
        id: 2,
        timeSec: 42,
        timeStr: '0:42',
        en: 'Engineers collaborate across borders to enhance battery storage capacity.',
        tr: 'Mühendisler pil depolama kapasitesini artırmak için sınırlar ötesinde iş birliği yapıyor.',
        level: 'B2',
        highlightWords: ['collaborate', 'enhance']
      }
    ]
  }
];

interface WatchingViewProps {
  onWordAdded?: (word: VocabularyWord) => void;
  onOpenInTutor?: (word: string) => void;
}

export const WatchingView: React.FC<WatchingViewProps> = ({
  onWordAdded,
  onOpenInTutor
}) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(CURATED_VIDEOS[0]);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [savedWordsMap, setSavedWordsMap] = useState<Record<string, boolean>>({});
  const [selectedWordPopup, setSelectedWordPopup] = useState<string | null>(null);

  const activeSubtitle = selectedVideo.subtitles[activeSubtitleIndex] || selectedVideo.subtitles[0];

  const handleWordClick = (rawWord: string) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return;
    setSelectedWordPopup(clean);
    LearningStorageService.speak(clean);
  };

  const handleSaveWord = (rawWord: string) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    const lookup = LearningStorageService.lookup(clean);
    const saved = LearningStorageService.addWord({
      word: clean,
      translation: lookup.translation,
      phonetic: lookup.phonetic,
      partOfSpeech: lookup.partOfSpeech,
      level: lookup.level,
      exampleSentence: activeSubtitle.en,
      exampleTranslation: activeSubtitle.tr
    });
    setSavedWordsMap((prev) => ({ ...prev, [clean]: true }));
    if (onWordAdded) onWordAdded(saved);
  };

  const handleSpeakSentence = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    // Extract youtube video id
    const match = customUrlInput.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const videoId = match ? match[1] : 'ad79nYk2keg';

    const customLesson: VideoLesson = {
      id: 'custom-' + Date.now(),
      title: 'Özel YouTube Video Dersi',
      channel: 'YouTube İçe Aktarma',
      level: 'B1',
      duration: 'Canlı',
      youtubeId: videoId,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      category: 'Özel',
      subtitles: [
        {
          id: 1,
          timeSec: 10,
          timeStr: '0:10',
          en: 'Welcome to this interactive English lesson with Chirmo dual subtitles.',
          tr: 'Chirmo çift altyazılı interaktif İngilizce dersine hoş geldiniz.',
          level: 'A2',
          highlightWords: ['interactive', 'lesson']
        },
        {
          id: 2,
          timeSec: 30,
          timeStr: '0:30',
          en: 'You can click on any word in the subtitle to see its meaning and pronunciation.',
          tr: 'Anlamını ve okunuşunu görmek için altyazıdaki herhangi bir kelimeye tıklayabilirsiniz.',
          level: 'B1',
          highlightWords: ['meaning', 'pronunciation']
        }
      ]
    };

    setSelectedVideo(customLesson);
    setActiveSubtitleIndex(0);
    setCustomUrlInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-1">
              <Tv className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Watching Mode</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Video & YouTube ile Çift Altyazılı Öğrenme
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              İngilizce ve Türkçe altyazılar senkronize akar. Altyazıdaki herhangi bir kelimeye tıklayarak anlamını öğren ve defterine ekle.
            </p>
          </div>

          {/* Custom YouTube URL input */}
          <form onSubmit={handleCustomUrlSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="YouTube Video Linki Yapıştır..."
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 w-56 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Yükle
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-6">
        {/* Main Video & Interactive Subtitle Theater */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player & Live Dual Subtitles */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=0&enablejsapi=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Interactive Dual Subtitle Display */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                    Aktif Altyazı ({activeSubtitle.timeStr})
                  </span>
                  <span className="text-xs text-slate-400">Kelimenin üzerine tıkla</span>
                </div>

                <button
                  onClick={() => handleSpeakSentence(activeSubtitle.en)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Cümleyi Dinle</span>
                </button>
              </div>

              {/* Clickable English Words */}
              <div className="flex flex-wrap gap-1.5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                {activeSubtitle.en.split(' ').map((rawWord, i) => {
                  const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
                  const isHighlighted = activeSubtitle.highlightWords.includes(clean);
                  const isSaved = !!savedWordsMap[clean];

                  return (
                    <button
                      key={i}
                      onClick={() => handleWordClick(rawWord)}
                      className={`px-2 py-1 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        isHighlighted
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400'
                          : 'hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                      } ${selectedWordPopup === clean ? 'ring-2 ring-purple-500' : ''}`}
                    >
                      {rawWord}
                    </button>
                  );
                })}
              </div>

              {/* Turkish Translation Line */}
              <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/40 text-xs font-medium text-purple-900 dark:text-purple-200 flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold text-purple-400">TR:</span>
                <span>{activeSubtitle.tr}</span>
              </div>

              {/* Quick Word Lookup Inspector */}
              {selectedWordPopup && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-blue-200 dark:border-slate-700 flex items-center justify-between animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-slate-900 dark:text-white capitalize">
                        {selectedWordPopup}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-800">
                        {LearningStorageService.lookup(selectedWordPopup).level}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                      {LearningStorageService.lookup(selectedWordPopup).translation}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSaveWord(selectedWordPopup)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1 ${
                        savedWordsMap[selectedWordPopup]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {savedWordsMap[selectedWordPopup] ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                      <span>{savedWordsMap[selectedWordPopup] ? 'Eklendi' : 'Deftere Ekle'}</span>
                    </button>

                    {onOpenInTutor && (
                      <button
                        onClick={() => onOpenInTutor(selectedWordPopup)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-700 text-blue-600 border border-slate-200 dark:border-slate-600 hover:bg-blue-50 text-xs font-bold"
                        title="AI Öğretmen ile Derin Analiz"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subtitles Timeline & Other Videos */}
          <div className="space-y-4">
            {/* Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Altyazı Akışı (Tıkla ve Git)
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedVideo.subtitles.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveSubtitleIndex(idx);
                      setSelectedWordPopup(null);
                    }}
                    className={`w-full text-left p-3 rounded-2xl text-xs transition-all border ${
                      activeSubtitleIndex === idx
                        ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-medium'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {sub.timeStr}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700">
                        {sub.level}
                      </span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed">{sub.en}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Other Curated Videos */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Önerilen Video Dersler
              </h3>

              <div className="space-y-2.5">
                {CURATED_VIDEOS.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setActiveSubtitleIndex(0);
                    }}
                    className={`cursor-pointer p-2.5 rounded-2xl border transition-all flex items-center space-x-3 ${
                      selectedVideo.id === vid.id
                        ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/20'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-16 h-12 object-cover rounded-xl shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{vid.channel} • {vid.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
