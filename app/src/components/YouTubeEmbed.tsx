import { useState } from 'react';
import { Play } from 'lucide-react';

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
};

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="absolute inset-0 w-full h-full group"
      aria-label={`${title} lejátszása`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        width={480}
        height={360}
      />
      <span className="absolute inset-0 bg-[#4A3F35]/25 group-hover:bg-[#4A3F35]/35 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-[#D4854A] text-white flex items-center justify-center shadow-warm-lg group-hover:scale-105 transition-transform">
          <Play className="w-7 h-7 ml-1" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}