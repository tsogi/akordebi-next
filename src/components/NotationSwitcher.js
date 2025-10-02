import { useLanguage } from '@/context/LanguageContext';
import { notations } from '@/utils/notations';

export default function NotationSwitcher({ 
    notationFormat, 
    onNotationFormatChange
}) {
    const { lang } = useLanguage();

    return (
        <div className="mb-4 w-full px-2">
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm p-3 border border-gray-700/50">
                <div className="space-y-3">
                    {notations.map((group) => (
                        <div key={group.name} className="space-y-2">
                            {/* Group Header */}
                            <div className="flex items-center space-x-2 px-2">
                                <img 
                                    src={group.icon}
                                    className="w-4 h-4 opacity-70" 
                                    alt={`${group.name} icon`}
                                />
                                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                                    {group.name}
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-600/50 to-transparent"></div>
                            </div>
                            
                            {/* Group Tabs */}
                            <div className="flex flex-wrap gap-1.5">
                                {group.tabs.map((tab) => (
                                    <button
                                        key={tab.code}
                                        onClick={() => onNotationFormatChange(tab.code)}
                                        className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 border ${
                                            notationFormat === tab.code
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border-blue-400/50 transform scale-[1.02] shadow-blue-500/20"
                                                : "bg-gray-700/50 text-gray-200 hover:bg-gray-600/60 border-gray-600/40 hover:border-gray-500/60 hover:text-white hover:shadow-sm"
                                        }`}
                                    >
                                        <span className="whitespace-nowrap">{tab.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 