import { Player } from '@lottiefiles/react-lottie-player';

interface TonIconProps {
    size?: number;
    className?: string;
}

export function TonIcon({ size = 18, className = '' }: TonIconProps) {
    return (
        <div 
            className={`flex items-center justify-center flex-shrink-0 ${className}`}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <Player
                autoplay={false}
                loop={false}
                src="/images/TgSticker_ffc8b1ff.json"
                style={{ width: `${size}px`, height: `${size}px` }}
            />
        </div>
    );
}
