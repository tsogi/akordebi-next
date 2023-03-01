const mysql = require('mysql2/promise');
const Fuse = require('fuse.js');

class Db{
    pool;

    constructor(){
        this.pool = mysql.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
    }

    async createConnection(){
        if(!this.pool) {

        }
    }

    async getSong(songId){
        const [rows,fields] = await this.pool.execute(`
            select songs.id, songs.videoLesson, songs.searchWords, songs.name, songs.body, GROUP_CONCAT(authors.name) as authors from songs 
            left join authors_songs on songs.id = authors_songs.song_id
            left join authors on authors_songs.author_id = authors.id
            where songs.id = ?
            group by songs.id
        `, [songId]);

        let song = rows[0];
        song.authors = song.authors ? song.authors.split(",") : [];

        return song;
    }

    async getAllSongs(){
        const [rows,fields] = await this.pool.execute(`
            select songs.name, songs.searchWords, songs.videoLesson, songs.id, songs.confirmed, IFNULL(GROUP_CONCAT(authors.name), "") as authors, IFNULL(GROUP_CONCAT(votes.vote), "") as votes from songs
            left join authors_songs on songs.id = authors_songs.song_id
            left join authors on authors_songs.author_id = authors.id
            left join votes on songs.id = votes.song_id
            group by songs.id
        `);

        for(let row of rows) {
            row.authors = row.authors ? [...new Set(row.authors.split(","))] : [];

            let votes = row.votes.split(",");
            delete row.votes;

            row.voteSum = votes.reduce((accumulator, current) => accumulator + parseInt(current), 0) || 0;
        }

        return rows;
    }

    async searchSongs(searchText){
        let songs = await this.getAllSongs();

        if(!searchText) { return songs; }

        const options = {
            isCaseSensitive: false,
            includeScore: true,
            includeMatches: true,
            useExtendedSearch: true,
            ignoreLocation: true,
            minMatchCharLength: 2,
            keys: ['searchWords']
          };

          function searchSongs(searchTerm) {
            const fuse = new Fuse(songs, options);
            const results = fuse.search(searchTerm);
            return results.length > 0 ? results : null;
          }

          let filteredSongs = searchSongs(searchText);
          let res = filteredSongs?.length ? filteredSongs.map(item => item.item) : [];
          
        return res;
    }

    async storeSong(data){
        let authorNames = data.authors.map(author => author.name);

        let authors = await this.storeAuthors(authorNames);

        let song = { name: data.name, body: data.songText, text: data.rawText, videoLesson: data.videoLesson, searchWords: data.searchWords }
        let songId = await this.storeSongToDb(song);

        await this.storeSongAuthors(authors.map(el => el.id), songId);

        return true;
    }

    async updateSong(data){
        let authorNames = data.authors.map(author => author.name);

        let authors = await this.storeAuthors(authorNames);

        await this.deleteSongAuthors(data.id);

        let song = { name: data.name, body: data.songText, text: data.rawText, videoLesson: data.videoLesson, searchWords: data.searchWords }
        await this.updateSongToDb(song, data.id);

        await this.storeSongAuthors(authors.map(el => el.id), data.id);

        return true;
    }

    async deleteSongAuthors(songId){
        await this.pool.execute('delete from authors_songs where song_id = ?', [songId]);
    }

    async storeSongAuthors(authorIds, songId) {
        if(!authorIds.length) {
            return true;
        }

        // Todo escape this query parameters
        let query = `
                INSERT INTO authors_songs (author_id, song_id) 
                VALUES ${authorIds.map(id => `("${id}", "${songId}")`).join(',\n  ')}
            `;

        await this.pool.execute(query);

        return true;
    }

    async getSongVotes(songId){
        const [rows] = await this.pool.execute('SELECT vote FROM votes WHERE song_id = ?', [songId]);

        return rows;
    }
    
    async getVoteForIp(songId, ip) {
        const [[existingVote]] = await this.pool.execute('SELECT vote FROM votes WHERE song_id = ? AND ip = ?', [songId, ip]);

        return existingVote;
    }

    async saveVote(songId, vote, ip){
        const [rows] = await this.pool.execute('INSERT INTO votes (song_id, vote, ip) VALUES (?, ?, ?)', [songId, vote, ip]);

        return rows.affectedRows;
    }

    async updateVote(songId, vote, ip){
        const [rows] = await this.pool.execute('UPDATE votes SET vote = ? WHERE song_id = ? AND ip = ?', [vote, songId, ip])

        return rows.affectedRows;
    }

    async storeSongToDb(song){
        let query = `
            insert into songs (name, body, text, videoLesson, searchWords)
            values (?, ?, ?, ?, ?)
        `;

        let [results] = await this.pool.execute(query, [song.name, song.body, song.text, song.videoLesson, song.searchWords])

        return results.insertId
    }

    async updateSongToDb(song, id){
        let query = `
            update songs 
            set name = ?, body = ?, text = ?, videoLesson = ?, searchWords = ?
            where id = ?
        `;

        await this.pool.execute(query, [song.name, song.body, song.text, song.videoLesson, song.searchWords, id])

        return true;
    }

    async storeAuthors(authors){
        if(!authors.length) {
            return []
        }
        // Todo protect this from sql injection
        let query = `
                INSERT IGNORE INTO authors (name) 
                VALUES ${authors.map(author => `("${author}")`).join(',\n  ')}
            `;

        await this.pool.execute(query);

        query = `
            select id from authors
            WHERE name IN (${authors.map(author => `"${author}"`).join(', ')})
        `

        let [results, fields] = await this.pool.execute(query);

        return results;
    }
}

module.exports = new Db();