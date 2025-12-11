import React, { useEffect, useRef, useState } from 'react';

export const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 自动播放音乐
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('自动播放被浏览器阻止，等待用户交互');
          setIsPlaying(false);
          // 添加一个一次性的用户交互监听器
          const handleInteraction = async () => {
            if (audioRef.current) {
              try {
                await audioRef.current.play();
                setIsPlaying(true);
                // 移除监听器
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('touchstart', handleInteraction);
              } catch (err) {
                console.error('播放失败:', err);
              }
            }
          };
          document.addEventListener('click', handleInteraction, { once: true });
          document.addEventListener('touchstart', handleInteraction, { once: true });
        }
      }
    };

    // 延迟一点播放，确保组件完全加载
    const timer = setTimeout(() => {
      playAudio();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop autoPlay>
        <source src="/music/christmas.mp3" type="audio/mpeg" />
      </audio>
      
      {/* 音乐控制按钮 */}
      <div className="fixed bottom-8 left-8 z-20 pointer-events-auto flex gap-3">
        <button
          onClick={togglePlay}
          className="px-6 py-3 border-2 border-[#D4AF37] bg-black/60 backdrop-blur-md hover:bg-[#D4AF37]/20 transition-all duration-300 hover:shadow-[0_0_20px_#D4AF37]"
        >
          <span className="text-[#D4AF37] font-serif text-sm tracking-wider">
            {isPlaying ? '⏸ 暂停' : '▶ 播放'}
          </span>
        </button>
        
        <button
          onClick={toggleMute}
          className="px-4 py-3 border-2 border-[#D4AF37] bg-black/60 backdrop-blur-md hover:bg-[#D4AF37]/20 transition-all duration-300 hover:shadow-[0_0_20px_#D4AF37]"
        >
          <span className="text-[#D4AF37] text-lg">
            {isMuted ? '🔇' : '🔊'}
          </span>
        </button>
      </div>
    </>
  );
};
