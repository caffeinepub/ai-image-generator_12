import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Facebook,
  Heart,
  Image,
  Instagram,
  Linkedin,
  Loader2,
  Sparkles,
  Trash2,
  Twitter,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteGeneration,
  useGetGenerations,
  useSaveGeneration,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

interface Platform {
  id: string;
  name: string;
  width: number;
  height: number;
  category: "social" | "dating";
  icon: React.ReactNode;
  emoji: string;
}

const PLATFORMS: Platform[] = [
  {
    id: "ig-post",
    name: "Instagram Post",
    width: 1080,
    height: 1080,
    category: "social",
    icon: <Instagram size={18} />,
    emoji: "📸",
  },
  {
    id: "ig-portrait",
    name: "Instagram Portrait",
    width: 1080,
    height: 1350,
    category: "social",
    icon: <Instagram size={18} />,
    emoji: "🖼️",
  },
  {
    id: "ig-story",
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    category: "social",
    icon: <Instagram size={18} />,
    emoji: "✨",
  },
  {
    id: "tiktok",
    name: "TikTok Cover",
    width: 1080,
    height: 1920,
    category: "social",
    icon: <span className="text-sm font-bold">TT</span>,
    emoji: "🎵",
  },
  {
    id: "twitter-post",
    name: "Twitter/X Post",
    width: 1200,
    height: 675,
    category: "social",
    icon: <Twitter size={18} />,
    emoji: "🐦",
  },
  {
    id: "twitter-header",
    name: "Twitter/X Header",
    width: 1500,
    height: 500,
    category: "social",
    icon: <Twitter size={18} />,
    emoji: "🔷",
  },
  {
    id: "fb-post",
    name: "Facebook Post",
    width: 1200,
    height: 630,
    category: "social",
    icon: <Facebook size={18} />,
    emoji: "👥",
  },
  {
    id: "fb-cover",
    name: "Facebook Cover",
    width: 820,
    height: 312,
    category: "social",
    icon: <Facebook size={18} />,
    emoji: "🌐",
  },
  {
    id: "li-post",
    name: "LinkedIn Post",
    width: 1200,
    height: 627,
    category: "social",
    icon: <Linkedin size={18} />,
    emoji: "💼",
  },
  {
    id: "li-banner",
    name: "LinkedIn Banner",
    width: 1584,
    height: 396,
    category: "social",
    icon: <Linkedin size={18} />,
    emoji: "🏢",
  },
  {
    id: "pinterest",
    name: "Pinterest Pin",
    width: 1000,
    height: 1500,
    category: "social",
    icon: <Image size={18} />,
    emoji: "📌",
  },
  {
    id: "snapchat",
    name: "Snapchat Story",
    width: 1080,
    height: 1920,
    category: "social",
    icon: <span className="text-sm font-bold">👻</span>,
    emoji: "👻",
  },
  {
    id: "tinder",
    name: "Tinder Profile",
    width: 640,
    height: 800,
    category: "dating",
    icon: <Heart size={18} />,
    emoji: "🔥",
  },
  {
    id: "bumble",
    name: "Bumble Profile",
    width: 640,
    height: 800,
    category: "dating",
    icon: <Heart size={18} />,
    emoji: "🐝",
  },
  {
    id: "hinge",
    name: "Hinge Profile",
    width: 640,
    height: 800,
    category: "dating",
    icon: <Heart size={18} />,
    emoji: "💘",
  },
];

const STYLE_CHIPS = [
  "Realistic",
  "Photographic",
  "Cinematic",
  "Artistic",
  "Anime",
  "Illustration",
  "Oil Painting",
  "Watercolor",
  "Digital Art",
  "Neon",
  "Vintage",
  "Minimalist",
  "3D Render",
  "Portrait",
  "Landscape",
];

function AppContent() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(
    PLATFORMS[0],
  );
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<"social" | "dating">("social");

  const { data: generations = [], isLoading: historyLoading } =
    useGetGenerations();
  const saveGeneration = useSaveGeneration();
  const deleteGeneration = useDeleteGeneration();

  const addStyleChip = useCallback((style: string) => {
    setPrompt((prev) => {
      const trimmed = prev.trim();
      return trimmed
        ? `${trimmed}, ${style.toLowerCase()} style`
        : `${style.toLowerCase()} style`;
    });
  }, []);

  const generateImage = useCallback(() => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${selectedPlatform.width}&height=${selectedPlatform.height}&seed=${seed}&nologo=true`;
    setImageUrl(url);
    setIsLoading(true);
    setHasError(false);
  }, [prompt, selectedPlatform]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    if (imageUrl) {
      saveGeneration.mutate({
        prompt: prompt.trim(),
        platform: selectedPlatform.name,
        imageUrl,
        width: selectedPlatform.width,
        height: selectedPlatform.height,
      });
      toast.success("Image generated and saved!");
    }
  }, [imageUrl, prompt, selectedPlatform, saveGeneration]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    toast.error("Failed to generate image. Try again.");
  }, []);

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${selectedPlatform.id}-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Download failed. Try right-clicking the image.");
    }
  }, [imageUrl, selectedPlatform.id]);

  const handleCopyUrl = useCallback(() => {
    if (!imageUrl) return;
    navigator.clipboard.writeText(imageUrl);
    toast.success("URL copied to clipboard!");
  }, [imageUrl]);

  const socialPlatforms = PLATFORMS.filter((p) => p.category === "social");
  const datingPlatforms = PLATFORMS.filter((p) => p.category === "dating");
  const displayPlatforms =
    activeTab === "social" ? socialPlatforms : datingPlatforms;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/40">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1200x400.jpg')",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center shadow-glow">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold gradient-text">
                PixelForge AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Social Media Image Generator
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="hidden sm:flex gap-1 items-center"
          >
            <Sparkles size={12} />
            Powered by Pollinations.ai
          </Badge>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel: Platform + Prompt */}
          <div className="xl:col-span-1 space-y-6">
            {/* Platform Picker */}
            <section className="glass-card rounded-2xl p-5">
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Image size={18} className="text-primary" />
                Platform
              </h2>

              {/* Category Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  data-ocid="platform.tab"
                  onClick={() => setActiveTab("social")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "social"
                      ? "btn-gradient text-white"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  📱 Social Media
                </button>
                <button
                  type="button"
                  data-ocid="platform.tab"
                  onClick={() => setActiveTab("dating")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "dating"
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  💕 Dating Apps
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto scrollbar-hide pr-1">
                {displayPlatforms.map((platform, i) => {
                  const ratio = platform.width / platform.height;
                  const isSelected = selectedPlatform.id === platform.id;
                  return (
                    <motion.button
                      key={platform.id}
                      data-ocid={`platform.card.${i + 1}`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isSelected
                          ? platform.category === "dating"
                            ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/40"
                            : "bg-primary/20 border border-primary/40 glow-border"
                          : "bg-muted/30 border border-transparent hover:border-border"
                      }`}
                    >
                      {/* Aspect ratio preview */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <div
                          className={`rounded ${
                            isSelected
                              ? platform.category === "dating"
                                ? "bg-gradient-to-br from-pink-500 to-rose-500"
                                : "btn-gradient"
                              : "bg-muted"
                          }`}
                          style={{
                            width: ratio >= 1 ? 28 : Math.round(28 * ratio),
                            height: ratio <= 1 ? 28 : Math.round(28 / ratio),
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {platform.emoji} {platform.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {platform.width} × {platform.height}
                        </div>
                      </div>
                      {isSelected && (
                        <ChevronRight
                          size={16}
                          className="text-primary flex-shrink-0"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Prompt Builder */}
            <section className="glass-card rounded-2xl p-5 space-y-4">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Wand2 size={18} className="text-accent" />
                Prompt
              </h2>

              <Textarea
                data-ocid="prompt.textarea"
                placeholder="Describe your image... e.g. A stunning sunset over a mountain lake with golden reflections"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-muted/30 border-border/60 focus:border-primary/60 resize-none text-sm"
              />

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Style chips — click to add:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_CHIPS.map((style, i) => (
                    <button
                      key={style}
                      type="button"
                      data-ocid={`style.chip.${i + 1}`}
                      onClick={() => addStyleChip(style)}
                      className="px-2.5 py-1 rounded-full text-xs bg-muted/50 border border-border/50 hover:border-primary/60 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                data-ocid="generate.primary_button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateImage}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-display font-semibold text-white btn-gradient flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Image
                  </>
                )}
              </motion.button>
            </section>
          </div>

          {/* Right Panel: Result + History */}
          <div className="xl:col-span-2 space-y-6">
            {/* Result Panel */}
            <section
              data-ocid="result.panel"
              className="glass-card rounded-2xl p-5"
            >
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Generated Image
                {selectedPlatform && (
                  <span className="ml-auto text-xs text-muted-foreground font-normal">
                    {selectedPlatform.emoji} {selectedPlatform.name} ·{" "}
                    {selectedPlatform.width}×{selectedPlatform.height}
                  </span>
                )}
              </h2>

              <div
                className="relative w-full rounded-xl overflow-hidden bg-muted/20 border border-border/40"
                style={{
                  aspectRatio: `${selectedPlatform.width} / ${selectedPlatform.height}`,
                  maxHeight: "70vh",
                }}
              >
                {/* Loading state */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      data-ocid="generate.loading_state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/80 backdrop-blur-sm"
                    >
                      <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mb-4 animate-pulse-glow">
                        <Sparkles size={28} className="text-white" />
                      </div>
                      <p className="font-display text-lg font-semibold gradient-text">
                        Creating your image...
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This may take a few seconds
                      </p>
                      <div className="mt-4 flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error state */}
                {hasError && !isLoading && (
                  <div
                    data-ocid="generate.error_state"
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <AlertCircle size={40} className="text-destructive mb-3" />
                    <p className="font-display font-semibold">
                      Generation Failed
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check your prompt and try again
                    </p>
                  </div>
                )}

                {/* Placeholder when no image */}
                {!imageUrl && !isLoading && !hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-3xl bg-muted/40 flex items-center justify-center mb-4">
                      <Image size={36} className="text-muted-foreground/40" />
                    </div>
                    <p className="font-display text-muted-foreground/60">
                      Your image will appear here
                    </p>
                    <p className="text-sm text-muted-foreground/40 mt-1">
                      Enter a prompt and click Generate
                    </p>
                  </div>
                )}

                {/* Actual image */}
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={prompt}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )}
              </div>

              {/* Action buttons */}
              {imageUrl && !isLoading && !hasError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mt-4"
                >
                  <Button
                    data-ocid="download.button"
                    onClick={handleDownload}
                    className="flex-1 btn-gradient text-white border-0 hover:opacity-90"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="border-border/60 hover:border-primary/60 hover:bg-primary/10"
                  >
                    <Copy size={16} className="mr-2" />
                    Copy URL
                  </Button>
                </motion.div>
              )}
            </section>

            {/* History Gallery */}
            <section
              data-ocid="history.panel"
              className="glass-card rounded-2xl p-5"
            >
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-muted-foreground" />
                History
                {generations.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {generations.length}
                  </Badge>
                )}
              </h2>

              {historyLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-muted/40 animate-pulse"
                    />
                  ))}
                </div>
              ) : generations.length === 0 ? (
                <div
                  data-ocid="history.empty_state"
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                    <Clock size={28} className="text-muted-foreground/40" />
                  </div>
                  <p className="font-display text-muted-foreground/60">
                    No generations yet
                  </p>
                  <p className="text-sm text-muted-foreground/40 mt-1">
                    Your generated images will appear here
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[...generations].reverse().map((gen, i) => (
                      <motion.div
                        key={String(gen.id)}
                        data-ocid={`history.item.${i + 1}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative rounded-xl overflow-hidden bg-muted/20 border border-border/40 hover:border-primary/40 transition-all"
                        style={{
                          aspectRatio: `${Number(gen.width)} / ${Number(gen.height)}`,
                        }}
                      >
                        <img
                          src={gen.imageUrl}
                          alt={gen.prompt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-white text-xs font-medium truncate">
                              {gen.platform}
                            </p>
                            <p className="text-white/60 text-xs truncate">
                              {gen.prompt}
                            </p>
                          </div>
                          <button
                            type="button"
                            data-ocid={`history.delete_button.${i + 1}`}
                            onClick={() => deleteGeneration.mutate(gen.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-destructive/80 flex items-center justify-center hover:bg-destructive transition-colors"
                          >
                            <Trash2 size={13} className="text-white" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-8">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} PixelForge AI. All rights reserved.
          </p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
