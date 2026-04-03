import { useState } from 'react';

interface CollectionFilterModalProps {
    onClose: () => void;
    onApply: (selectedCollections: string[]) => void;
}

const collections = [
    'Heart Locket',
    'Plush Pepe',
    'Heroic Helmet',
    'Mighty Arm',
    'Ion Gem',
    "Durov's Cap",
    'Nail Bracelet',
    'Perfume Bottle',
    'Magic Potion',
    'Mini Oscar',
    'Astral Shard',
    'Artisan Brick',
    'Gem Signet',
    'Sharp Tongue',
    'Moon Pendant',
    'Lunar Snake',
    'Holiday Drink',
    'Record Player',
    'Joyful Bundle',
    'Restless Jar',
    'Big Year',
    'Light Sword',
    'Jingle Bells',
    'Eternal Candle',
    'Skull Flower',
    'Sakura Flower',
    'Jelly Bunny',
    'Cupid Charm',
    'Hanging Star',
    'Easter Egg',
    'Spy Agaric',
    'Homemade Cake',
    'Snow Globe',
    'Xmas Stocking',
    'B-Day Candle',
    'Candy Cane',
    'Lush Bouquet',
    'Top Hat',
    'Scared Cat',
    'Spiced Wine',
    'Evil Eye',
    'Ionic Dryer',
    'Ginger Cookie',
    'Hex Pot',
    'Stellar Rocket',
    'Trapped Heart',
    'Snake Box',
    'Loot Bag',
    'Electric Skull',
    'Love Candle',
    'Jack-in-the-Box',
    'Witch Hat',
    'Love Potion',
    'Kissed Frog',
    'Diamond Ring',
    'Neko Helmet',
    'Pet Snake',
    'Jester Hat',
    'Flying Broom',
    'Party Sparkler',
    'Star Notepad',
    'Voodoo Doll',
    'Bonded Ring',
    'Snow Mittens',
    'Crystal Ball',
    'Berry Box',
    'Tama Gadget',
    'Valentine Box',
    'Cookie Heart',
    'Precious Peach',
    'Bow Tie',
    'Signet Ring',
    'Lol Pop',
    'Santa Hat',
    'Hypno Lollipop',
    'Winter Wreath',
    'Vintage Cigar',
    'Bunny Muffin',
    'Mad Pumpkin',
    'Eternal Rose',
    'Jolly Chimp',
    'Input Key',
    'Desk Calendar',
    'Swiss Watch',
    'Sleigh Bell',
    'Toy Bear',
    'Sky Stilettos',
    'Fresh Socks',
    'Clover Pin',
    'Instant Ramen',
    'Mousse Cake',
    'Spring Basket',
    'Faith Amulet',
    'UFC Strike',
    'Snoop Dogg',
    'Swag Bag',
    'Snoop Cigar',
    'Low Rider',
    'Westside Sign',
    "Khabib's Papakha",
];

export function CollectionFilterModal({ onClose, onApply }: CollectionFilterModalProps) {
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

    const toggleCollection = (collection: string) => {
        if (selectedCollections.includes(collection)) {
            setSelectedCollections(selectedCollections.filter(c => c !== collection));
        } else {
            setSelectedCollections([...selectedCollections, collection]);
        }
    };

    const handleReset = () => {
        setSelectedCollections([]);
    };

    const handleApply = () => {
        onApply(selectedCollections);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', maxHeight: '80vh' }}>
                <h2 className="text-white text-[24px] font-semibold text-center mb-4">Коллекции</h2>

                {/* Collections List - goes to bottom of screen */}
                <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                    <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-2 pb-[100px]">
                        {collections.map((collection, index) => (
                            <button
                                key={index}
                                onClick={() => toggleCollection(collection)}
                                className="w-full p-3 flex items-center gap-3 transition-colors"
                                style={{
                                    borderBottom: index < collections.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                }}
                            >
                                {/* Checkbox */}
                                <div className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
                                    <img 
                                        src={selectedCollections.includes(collection) ? "/images/1checkbox.png" : "/images/checkbox.png"}
                                        alt="checkbox" 
                                        className="w-[20px] h-[20px]"
                                        style={{
                                            filter: selectedCollections.includes(collection) 
                                                ? 'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2878%) hue-rotate(195deg) brightness(102%) contrast(101%)'
                                                : 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(80%)'
                                        }}
                                    />
                                </div>
                                <span className="text-white text-[16px] text-left flex-1">{collection}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons - Overlay on top */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-6 z-10" style={{ background: 'linear-gradient(to top, #1C1C1E 70%, transparent)' }}>
                    <button
                        onClick={handleReset}
                        className="flex-1 rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                        style={{ backgroundColor: '#2F2F2F' }}
                    >
                        Сбросить
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                    >
                        Применить
                    </button>
                </div>
            </div>
        </>
    );
}
