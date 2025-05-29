import fs from 'fs';
import path from 'path';
import { notations } from '@/utils/notations';

export default function handler(req, res) {
    const { type } = req.query;
    
    // Find the category and tab that matches the type
    let chordType = null;
    for (const category of notations) {
        const tab = category.tabs.find(tab => tab.category === type);
        if (tab) {
            chordType = tab;
            break;
        }
    }

    if (!chordType) {
        return res.status(400).json({ error: 'Invalid chord type' });
    }

    try {
        const chordsDir = path.join(process.cwd(), 'public', chordType.chordsDir);
        const files = fs.readdirSync(chordsDir);
        
        // Filter only PNG files and sort them alphabetically
        const chordFiles = files
            .filter(file => file.endsWith('.png'))
            .sort((a, b) => a.localeCompare(b));

        res.status(200).json(chordFiles);
    } catch (error) {
        console.error('Error reading chords directory:', error);
        res.status(500).json({ error: 'Failed to fetch chords' });
    }
} 