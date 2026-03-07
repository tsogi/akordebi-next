#!/usr/bin/env node

/**
 * MySQL to SQLite Export Script
 * 
 * Exports songs, authors, and authors_songs tables from MySQL to a SQLite database
 * for bundling with the React Native app.
 * 
 * Usage: node scripts/export-to-sqlite.js
 * 
 * Output: ../akordebi_react_native/assets/bundled.db
 */

const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const OUTPUT_PATH = path.join(__dirname, '../../akordebi_react_native/assets/bundled.db');
const DB_VERSION = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

async function main() {
  console.log('Starting MySQL to SQLite export...\n');

  // Connect to MySQL
  const mysqlConn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'nikoloz93',
    database: process.env.DB_DATABASE || 'akordebi.ge',
  });

  console.log('Connected to MySQL');

  // Remove existing SQLite file if exists
  if (fs.existsSync(OUTPUT_PATH)) {
    fs.unlinkSync(OUTPUT_PATH);
    console.log('Removed existing bundled.db');
  }

  // Ensure assets directory exists
  const assetsDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Create SQLite database
  const sqlite = new Database(OUTPUT_PATH);
  console.log('Created new SQLite database');

  // Create tables
  sqlite.exec(`
    -- Songs table
    CREATE TABLE songs (
      id INTEGER PRIMARY KEY,
      name TEXT,
      url TEXT,
      body TEXT,
      text TEXT,
      confirmed INTEGER DEFAULT 0,
      videoLesson TEXT,
      searchWords TEXT,
      uploader TEXT,
      difficulty INTEGER DEFAULT 10,
      notation_format TEXT DEFAULT 'guitar_chord',
      view_count INTEGER DEFAULT 0,
      capo_location INTEGER
    );

    -- Authors table
    CREATE TABLE authors (
      id INTEGER PRIMARY KEY,
      name TEXT
    );

    -- Authors-Songs junction table
    CREATE TABLE authors_songs (
      id INTEGER PRIMARY KEY,
      author_id INTEGER,
      song_id INTEGER
    );

    -- User favorites (local data, not exported from MySQL)
    CREATE TABLE favorites (
      song_id INTEGER PRIMARY KEY,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      synced INTEGER DEFAULT 0
    );

    -- User tonality preferences (local data)
    CREATE TABLE user_tonality (
      song_id INTEGER PRIMARY KEY,
      tonality INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0
    );

    -- Offline sync queue
    CREATE TABLE pending_sync (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT,
      song_id INTEGER,
      payload TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      retry_count INTEGER DEFAULT 0
    );

    -- Database metadata
    CREATE TABLE db_metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    -- Indexes for performance
    CREATE INDEX idx_songs_url ON songs(url);
    CREATE INDEX idx_songs_notation ON songs(notation_format);
    CREATE INDEX idx_songs_search ON songs(searchWords);
    CREATE INDEX idx_authors_songs_song ON authors_songs(song_id);
    CREATE INDEX idx_authors_songs_author ON authors_songs(author_id);
  `);
  console.log('Created SQLite tables and indexes');

  // Export songs
  console.log('\nExporting songs...');
  const [songs] = await mysqlConn.execute(`
    SELECT id, name, url, body, text, confirmed, videoLesson, searchWords, 
           uploader, difficulty, notation_format, view_count, capo_location
    FROM songs
    ORDER BY id
  `);

  const insertSong = sqlite.prepare(`
    INSERT INTO songs (id, name, url, body, text, confirmed, videoLesson, searchWords, 
                       uploader, difficulty, notation_format, view_count, capo_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertManySongs = sqlite.transaction((songs) => {
    for (const song of songs) {
      insertSong.run(
        song.id,
        song.name,
        song.url,
        typeof song.body === 'object' ? JSON.stringify(song.body) : song.body,
        song.text,
        song.confirmed ? 1 : 0,
        song.videoLesson,
        song.searchWords,
        song.uploader,
        song.difficulty,
        song.notation_format,
        song.view_count,
        song.capo_location
      );
    }
  });

  insertManySongs(songs);
  console.log(`  Exported ${songs.length} songs`);

  // Export authors
  console.log('\nExporting authors...');
  const [authors] = await mysqlConn.execute('SELECT id, name FROM authors ORDER BY id');

  const insertAuthor = sqlite.prepare('INSERT INTO authors (id, name) VALUES (?, ?)');
  const insertManyAuthors = sqlite.transaction((authors) => {
    for (const author of authors) {
      insertAuthor.run(author.id, author.name);
    }
  });

  insertManyAuthors(authors);
  console.log(`  Exported ${authors.length} authors`);

  // Export authors_songs
  console.log('\nExporting authors_songs relationships...');
  const [authorsSongs] = await mysqlConn.execute(
    'SELECT id, author_id, song_id FROM authors_songs ORDER BY id'
  );

  const insertAuthorSong = sqlite.prepare(
    'INSERT INTO authors_songs (id, author_id, song_id) VALUES (?, ?, ?)'
  );
  const insertManyAuthorsSongs = sqlite.transaction((relations) => {
    for (const rel of relations) {
      insertAuthorSong.run(rel.id, rel.author_id, rel.song_id);
    }
  });

  insertManyAuthorsSongs(authorsSongs);
  console.log(`  Exported ${authorsSongs.length} author-song relationships`);

  // Store metadata
  const insertMeta = sqlite.prepare('INSERT INTO db_metadata (key, value) VALUES (?, ?)');
  insertMeta.run('db_version', DB_VERSION);
  insertMeta.run('exported_at', new Date().toISOString());
  insertMeta.run('songs_count', songs.length.toString());
  insertMeta.run('authors_count', authors.length.toString());

  // Get file size
  const stats = fs.statSync(OUTPUT_PATH);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  // Close connections
  sqlite.close();
  await mysqlConn.end();

  console.log('\n========================================');
  console.log('Export completed successfully!');
  console.log('========================================');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Size: ${fileSizeMB} MB`);
  console.log(`Version: ${DB_VERSION}`);
  console.log(`Songs: ${songs.length}`);
  console.log(`Authors: ${authors.length}`);
  console.log(`Relationships: ${authorsSongs.length}`);
  console.log('\nNext steps:');
  console.log('1. Build and release your React Native app');
  console.log('2. The bundled.db will be included in the app assets');
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
