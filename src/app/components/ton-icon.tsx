import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '/images/TgSticker_ffc8b1ff.json';

interface TonIconProps {
    size?: number;
    className?: string;
}

export function TonIcon({ size = 24, className = '' }: TonIconProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: animationData,
        });

        // Показываем первый кадр (статичная картинка)
        animation.goToAndStop(0, true);

        return () => {
            animation.destroy();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className={className}
            style={{ width: size, height: size, display: 'inline-block' }}
        />
    );
}
