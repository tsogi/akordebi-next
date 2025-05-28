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
        <div className="flex flex-col gap-2 mb-6">
            {/* Group selector */}
            <div className="flex justify-center overflow-x-auto">
                <div className="inline-flex rounded-lg shadow-md bg-gradient-to-r from-gray-800 to-gray-900 p-1 max-w-full">
                    {notations.map((group) => (
                        <button
                            key={group.name}
                            onClick={() => {
                                setSelectedGroup(group.name);
                                onNotationFormatChange(group.tabs[0].code);
                            }}
                            className={`flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                                selectedGroup === group.name
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                    : "text-gray-200 hover:bg-gray-700"
                            }`}
                        >
                            <img 
                                src={group.icon}
                                className={`w-5 h-5 ${selectedGroup === group.name ? "brightness-[1.75] contrast-[0.7]" : ""}`} 
                                alt={`${group.name} icon`}
                            />
                            <span>{group.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab selector */}
            {currentGroup && (
                <div className="flex justify-center overflow-x-auto">
                    <div className="inline-flex rounded-lg shadow-md bg-gradient-to-r from-gray-800 to-gray-900 p-1 max-w-full">
                        {currentGroup.tabs.map((tab) => (
                            <button
                                key={tab.code}
                                onClick={() => onNotationFormatChange(tab.code)}
                                className={`flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                                    notationFormat === tab.code
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                        : "text-gray-200 hover:bg-gray-700"
                                }`}
                            >
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 