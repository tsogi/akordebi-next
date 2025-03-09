export function generateRandomId() {
    return 'temp_' + Math.random().toString(36).substr(2, 9);
} 