CREATE TABLE contributor_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    song_id INT NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_song_id (song_id),
    INDEX idx_paid (paid),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_user_song (user_id, song_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
); 