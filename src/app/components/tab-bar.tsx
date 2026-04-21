import type { Tab } from '../App';
import { useRef, useEffect, useState } from 'react';
import { BASE_PATH } from '../../../config';
// @ts-ignore
import translates from '../../../translates';
interface TabBarProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    lang: any
}

const imgTrade = BASE_PATH + '/images/trade.png';
const imgGift = BASE_PATH + '/images/gift.png';
const imgProfile = BASE_PATH + '/images/profile.png';

export function TabBar({ activeTab, onTabChange, lang }: TabBarProps) {
    const tradesRef = useRef<HTMLButtonElement>(null);
    const giftsRef = useRef<HTMLButtonElement>(null);
    const profileRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [ovalStyle, setOvalStyle] = useState({ left: 0, width: 110 });
    const [pressedButton, setPressedButton] = useState<Tab | null>(null);

    useEffect(() => {
        const updateOvalPosition = () => {
            let activeRef;
            switch (activeTab) {
                case 'trades': activeRef = tradesRef; break;
                case 'gifts': activeRef = giftsRef; break;
                case 'profile': activeRef = profileRef; break;
                default: activeRef = tradesRef;
            }

            if (activeRef.current && containerRef.current) {
                const buttonRect = activeRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                const left = buttonRect.left - containerRect.left + (buttonRect.width / 2) - 55;
                setOvalStyle({ left, width: 110 });
            }
        };

        updateOvalPosition();
        window.addEventListener('resize', updateOvalPosition);
        return () => window.removeEventListener('resize', updateOvalPosition);
    }, [activeTab]);

    const handleButtonPress = (tab: Tab) => {
        setPressedButton(tab);
        setTimeout(() => {
            setPressedButton(null);
            onTabChange(tab);
        }, 150);
    };

    return (
        <div className="absolute left-0 right-0 flex items-end justify-center px-4" style={{ bottom: '28px' }}>
            <div
                ref={containerRef}
                className="rounded-full h-[70px] flex items-center"
                style={{
                    width: '100%',
                    maxWidth: '390px',
                    position: 'relative',
                    background: 'rgba(28, 28, 30, 0.4)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    boxShadow: `
            0 -0.5px 0 0 rgba(180, 180, 180, 0.25),
            -0.5px -0.5px 0 0 rgba(180, 180, 180, 0.2),
            0.5px -0.5px 0 0 rgba(180, 180, 180, 0.2),
            -1px -1px 0 0 rgba(180, 180, 180, 0.1),
            1px -1px 0 0 rgba(180, 180, 180, 0.1)
          `,
                    paddingLeft: '24px',
                    paddingRight: '12px',
                    justifyContent: 'space-between'
                }}
            >
                {/* Animated oval background */}
                <div
                    style={{
                        position: 'absolute',
                        width: `${ovalStyle.width}px`,
                        height: '64px',
                        borderRadius: '50px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        boxShadow: `
              -0.5px 0 0 0 rgba(255, 255, 255, 0.15),
              -0.5px -0.3px 0 0 rgba(255, 255, 255, 0.1),
              -1px -0.5px 0 0 rgba(255, 255, 255, 0.05),
              0.5px 0 0 0 rgba(255, 255, 255, 0.15),
              0.5px 0.3px 0 0 rgba(255, 255, 255, 0.1),
              1px 0.5px 0 0 rgba(255, 255, 255, 0.05),
              inset 0 1px 3px rgba(0, 0, 0, 0.5)
            `,
                        left: `${ovalStyle.left}px`,
                        transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        top: '50%',
                        marginTop: '-32px',
                        pointerEvents: 'none'
                    }}
                />

                <button
                    ref={tradesRef}
                    onClick={() => handleButtonPress('trades')}
                    className="flex flex-col items-center justify-center gap-[3px] relative z-10"
                    style={{
                        padding: '10px 12px',
                        transform: pressedButton === 'trades' ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <img
                        src={imgTrade}
                        alt="Trades"
                        style={{
                            width: '32px',
                            height: '32px',
                            filter: activeTab === 'trades'
                                ? 'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2878%) hue-rotate(195deg) brightness(102%) contrast(101%)'
                                : 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(80%)'
                        }}
                    />
                    <span
                        style={{
                            fontSize: '13px',
                            color: activeTab === 'trades' ? '#007AFF' : '#8E8E93'
                        }}
                    >
            {lang.tab_bar.trades}
          </span>
                </button>

                <button
                    ref={giftsRef}
                    onClick={() => handleButtonPress('gifts')}
                    className="flex flex-col items-center justify-center gap-[3px] relative z-10"
                    style={{
                        padding: '10px 12px',
                        marginLeft: '8px',
                        transform: pressedButton === 'gifts' ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <img
                        src={imgGift}
                        alt="Gifts"
                        style={{
                            width: '32px',
                            height: '32px',
                            filter: activeTab === 'gifts'
                                ? 'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2878%) hue-rotate(195deg) brightness(102%) contrast(101%)'
                                : 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(80%)'
                        }}
                    />
                    <span
                        style={{
                            fontSize: '13px',
                            color: activeTab === 'gifts' ? '#007AFF' : '#8E8E93'
                        }}
                    >
            {lang.tab_bar.gifts}
          </span>
                </button>

                <button
                    ref={profileRef}
                    onClick={() => handleButtonPress('profile')}
                    className="flex flex-col items-center justify-center gap-[3px] relative z-10"
                    style={{
                        padding: '10px 12px',
                        marginRight: '6px',
                        transform: pressedButton === 'profile' ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <img
                        src={imgProfile}
                        alt="Profile"
                        style={{
                            width: '32px',
                            height: '32px',
                            filter: activeTab === 'profile'
                                ? 'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2878%) hue-rotate(195deg) brightness(102%) contrast(101%)'
                                : 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(80%)'
                        }}
                    />
                    <span
                        style={{
                            fontSize: '13px',
                            color: activeTab === 'profile' ? '#007AFF' : '#8E8E93'
                        }}
                    >
            {lang.tab_bar.profile}
          </span>
                </button>
            </div>
        </div>
    );
}
