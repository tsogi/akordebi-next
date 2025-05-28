import { useLanguage } from '@/context/LanguageContext';
import { notations } from '@/utils/notations';
import { useState } from 'react';

export default function NotationSwitcher({ 
    notationFormat, 
    onNotationFormatChange
}) {
    const { lang } = useLanguage();
    const [selectedGroup, setSelectedGroup] = useState("გიტარა");
    
    const currentGroup = notations.find(n => n.name === selectedGroup);
    const currentTab = currentGroup?.tabs.find(t => t.code === notationFormat) || currentGroup?.tabs[0];

    return (
        <div className="mb-4 w-full px-2.5 md:px-0 md:max-w-[500px] md:mx-auto">
            <div className="flex flex-col rounded-xl shadow-lg bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-1 border border-gray-700/50">
                {/* Group selector */}
                <div className="flex overflow-x-auto">
                    <div className="flex rounded-lg bg-gray-800/50 p-0.5 w-full">
                        {notations.map((group) => (
                            <button
                                key={group.name}
                                onClick={() => {
                                    setSelectedGroup(group.name);
                                    onNotationFormatChange(group.tabs[0].code);
                                }}
                                className={`flex items-center justify-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-1 ${
                                    selectedGroup === group.name
                                        ? "bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white shadow-md"
                                        : "text-gray-200 hover:bg-gray-700/50"
                                }`}
                            >
                                <img 
                                    src={group.icon}
                                    className={`w-4 h-4 transition-transform duration-200`} 
                                    alt={`${group.name} icon`}
                                />
                                <span>{group.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab selector */}
                {currentGroup && (
                    <div className="flex overflow-x-auto mt-1">
                        <div className="flex rounded-lg bg-gray-800/50 p-0.5 w-full">
                            {currentGroup.tabs.map((tab) => (
                                <button
                                    key={tab.code}
                                    onClick={() => onNotationFormatChange(tab.code)}
                                    className={`flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-1 ${
                                        notationFormat === tab.code
                                            ? "bg-gradient-to-r from-indigo-500/90 to-purple-600/90 text-white shadow-md"
                                            : "text-gray-300 hover:bg-gray-700/50"
                                    }`}
                                >
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 