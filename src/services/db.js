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

    async setUserData(user){
        const id = user.id;
        const email = user.email;
        const fullName = user.user_metadata.full_name ?? '';

        let query = `
            insert into users (id, email, full_name)
            values (?, ?, ?)
            on duplicate key update email = ?, full_name = ?
        `;

        await this.pool.execute(query, [id, email, fullName, email, fullName])

        const userDetails = await this.getUserByID(id);

        return userDetails;
    }

    async getUserByID(id){
        const [rows,fields] = await this.pool.execute(`
            select * from users where id = ?
        `, [id]);

        if(rows.length){
            return rows[0];
        }
        return null;
    }

    async addSongToFavorites(songId, userId){
        const [rows,fields] = await this.pool.execute(`
            insert into favorite_songs (song_id, user_id)
            values (?, ?)
        `, [songId, userId]);

        return rows.affectedRows;
    }

    async removeSongFromFavorites(songId, userId){
        const [rows,fields] = await this.pool.execute(`
            delete from favorite_songs where song_id = ? and user_id = ?
        `, [songId, userId]);

        return rows.affectedRows;
    }

    // Todo Most of the code in getSong(), getSongByUrl(), getSongByName() are duplicated. Fix DRY
    async getSong(songId){
        const [rows,fields] = await this.pool.execute(`
            select songs.id, songs.videoLesson, songs.url, songs.uploader, songs.searchWords, songs.name, songs.body, GROUP_CONCAT(authors.name) as authors from songs 
            left join authors_songs on songs.id = authors_songs.song_id
            left join authors on authors_songs.author_id = authors.id
            where songs.id = ?
            group by songs.id
        `, [songId]);

        if(rows.length){
            let song = rows[0];
            song.authors = song.authors ? song.authors.split(",") : [];

            return song;
        }

        return null;
    }

    async getSongByUrl(url, userID = null){
        const [rows,fields] = await this.pool.execute(`
            SELECT 
                songs.id, 
                songs.videoLesson, 
                songs.url,
                songs.uploader, 
                songs.searchWords, 
                songs.name, 
                songs.body, 
                songs.uploaderUserId,
                songs.notation_format,
                GROUP_CONCAT(DISTINCT authors.name ORDER BY authors.name) AS authors,
                MAX(IF(favorite_songs.user_id IS NOT NULL AND favorite_songs.song_id = songs.id, TRUE, FALSE)) AS isFavorite
            FROM songs
            LEFT JOIN authors_songs ON songs.id = authors_songs.song_id
            LEFT JOIN authors ON authors_songs.author_id = authors.id
            LEFT JOIN favorite_songs ON songs.id = favorite_songs.song_id AND favorite_songs.user_id = '${userID}'
            WHERE songs.url = ?
            GROUP BY songs.id;
        `, [url]);

        if(rows.length){
            let song = rows[0];
            song.authors = song.authors ? song.authors.split(",") : [];

            return song;
        }

        return null;
    }

    async getSongById(songId){
        const [rows,fields] = await this.pool.execute(`
            select songs.id, songs.videoLesson, songs.uploaderUserId, songs.uploader, songs.searchWords, songs.name, songs.body, GROUP_CONCAT(authors.name) as authors from songs 
            left join authors_songs on songs.id = authors_songs.song_id
            left join authors on authors_songs.author_id = authors.id
            where songs.id = ?
            group by songs.id
        `, [songId]);

        if(rows.length){
            let song = rows[0];
            song.authors = song.authors ? song.authors.split(",") : [];

            return song;
        }

        return null;
    }

    async getSongByName(songName){
        const [rows,fields] = await this.pool.execute(`
            select songs.id, songs.videoLesson, songs.uploader, songs.searchWords, songs.name, songs.body, GROUP_CONCAT(authors.name) as authors from songs 
            left join authors_songs on songs.id = authors_songs.song_id
            left join authors on authors_songs.author_id = authors.id
            where songs.name = ?
            group by songs.id
        `, [songName]);

        if(rows.length){
            let song = rows[0];
            song.authors = song.authors ? song.authors.split(",") : [];

            return song;
        }

        return null;
    }

    async getSongByUrlAndNotation(url, notation_format, userID = null){
        const [rows,fields] = await this.pool.execute(`
            SELECT 
                songs.id, 
                songs.videoLesson, 
                songs.url,
                songs.uploader, 
                songs.searchWords, 
                songs.name, 
                songs.body, 
                songs.uploaderUserId,
                songs.notation_format,
                GROUP_CONCAT(DISTINCT authors.name ORDER BY authors.name) AS authors,
                MAX(IF(favorite_songs.user_id IS NOT NULL AND favorite_songs.song_id = songs.id, TRUE, FALSE)) AS isFavorite
            FROM songs
            LEFT JOIN authors_songs ON songs.id = authors_songs.song_id
            LEFT JOIN authors ON authors_songs.author_id = authors.id
            LEFT JOIN favorite_songs ON songs.id = favorite_songs.song_id AND favorite_songs.user_id = '${userID}'
            WHERE songs.url = ? AND songs.notation_format = ?
            GROUP BY songs.id;
        `, [url, notation_format]);

        if(rows.length){
            let song = rows[0];
            song.authors = song.authors ? song.authors.split(",") : [];

            return song;
        }

        return null;
    }

    async getAllSongsSorted(userID = null){
        let initialSongs = await this.getAllSongs(userID);

        const compare = (a, b) => {
            // First, check if both have videoLesson and confirmed=1
            if (a.videoLesson && a.confirmed === 1 && b.videoLesson && b.confirmed === 1) {
                return b.voteSum - a.voteSum; // Sort by voteSum
            } else if (a.videoLesson && a.confirmed === 1) {
                return -1; // a comes before b
            } else if (b.videoLesson && b.confirmed === 1) {
                return 1; // b comes before a
            } else if(a.confirmed && b.confirmed) {
                return b.voteSum - a.voteSum;
            } else if(a.confirmed) {
                return -1;
            } else if(b.confirmed) {
                return 1;
            } else {
                return b.voteSum - a.voteSum;
            } 
        };
        
        initialSongs.sort(compare);
        
        return initialSongs;
    }

    async getAllSongs(userID = null){
        const [rows,fields] = await this.pool.execute(`
                SELECT 
                songs.name, 
                songs.url, 
                songs.searchWords, 
                songs.videoLesson, 
                songs.id, 
                songs.view_count,
                songs.notation_format,
                songs.uploaderUserId,
                songs.confirmed, 
                IFNULL(authors_agg.authors, "") as authors, 
                IFNULL(votes_agg.votes, "") as votes,
                ROUND(AVG(difficulties.difficulty)) as difficulty, 
                MAX(IF(favorite_songs.user_id IS NOT NULL AND favorite_songs.song_id = songs.id, TRUE, FALSE)) AS isFavorite
            FROM songs
            LEFT JOIN (
                SELECT 
                    authors_songs.song_id,
                    GROUP_CONCAT(authors.name) AS authors
                FROM authors_songs
                JOIN authors ON authors_songs.author_id = authors.id
                GROUP BY authors_songs.song_id
            ) AS authors_agg ON songs.id = authors_agg.song_id
            LEFT JOIN (
                SELECT 
                    votes.song_id,
                    GROUP_CONCAT(votes.vote) AS votes
                FROM votes
                GROUP BY votes.song_id
            ) AS votes_agg ON songs.id = votes_agg.song_id
            LEFT JOIN favorite_songs ON songs.id = favorite_songs.song_id AND favorite_songs.user_id = '${userID}'
            LEFT JOIN difficulties ON songs.id = difficulties.song_id
            GROUP BY songs.id;
        `);

        for(let row of rows) {
            row.authors = row.authors ? [...new Set(row.authors.split(","))] : [];

            let votes = row.votes.split(",");
            delete row.votes;

            row.voteSum = votes.reduce((accumulator, current) => accumulator + parseInt(current), 0) || 0;

            row.difficulty = parseInt(row.difficulty) || 11;
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
          let res = filteredSongs?.length ? filteredSongs.slice(0, 5).map(item => item.item) : [];
          
        return res;
    }

    async storeSong(data){
        let authorNames = data.authors.map(author => author.name);

        let authors = await this.storeAuthors(authorNames);

        let song = { name: data.name, url: data.url, body: data.songText, text: data.rawText, videoLesson: data.videoLesson, searchWords: data.searchWords, uploader: data.uploader, userId: data.userId, notation_format: data.notation_format }
        let songId = await this.storeSongToDb(song);

        await this.storeSongAuthors(authors.map(el => el.id), songId);

        return true;
    }

    async updateSong(data){
        let authorNames = data.authors.map(author => author.name);

        let authors = await this.storeAuthors(authorNames);

        await this.deleteSongAuthors(data.id);

        let song = { name: data.name, url: data.url, body: data.songText, text: data.rawText, videoLesson: data.videoLesson, searchWords: data.searchWords, uploader: data.uploader, userId: data.userId, notation_format: data.notation_format }
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

    async getSongDifficulties(songId){
        const [rows] = await this.pool.execute('SELECT difficulty FROM difficulties WHERE song_id = ?', [songId]);

        return rows;
    }
    
    async getVoteForIp(songId, ip) {
        const [[existingVote]] = await this.pool.execute('SELECT vote FROM votes WHERE song_id = ? AND ip = ?', [songId, ip]);

        return existingVote;
    }

    async getDifficultyForIp(songId, ip) {
        const [[existingVote]] = await this.pool.execute('SELECT difficulty FROM difficulties WHERE song_id = ? AND ip = ?', [songId, ip]);

        return existingVote;
    }

    async saveVote(songId, vote, ip){
        const [rows] = await this.pool.execute('INSERT INTO votes (song_id, vote, ip) VALUES (?, ?, ?)', [songId, vote, ip]);

        return rows.affectedRows;
    }

    async saveDifficulty(songId, difficulty, ip){
        const [rows] = await this.pool.execute('INSERT INTO difficulties (song_id, difficulty, ip) VALUES (?, ?, ?)', [songId, difficulty, ip]);

        return rows.affectedRows;
    }

    async storeLog(eventName, eventDetails, ip){
        const [rows] = await this.pool.execute('INSERT INTO logs (event, details, ip) VALUES (?, ?, ?)', [eventName, eventDetails, ip]);

        return rows.affectedRows;
    }

    async updateVote(songId, vote, ip){
        const [rows] = await this.pool.execute('UPDATE votes SET vote = ? WHERE song_id = ? AND ip = ?', [vote, songId, ip])

        return rows.affectedRows;
    }

    async updateDifficulty(songId, difficulty, ip){
        const [rows] = await this.pool.execute('UPDATE difficulties SET difficulty = ? WHERE song_id = ? AND ip = ?', [difficulty, songId, ip])

        return rows.affectedRows;
    }

    async storeSongToDb(song){
        let query = `
            insert into songs (name, url, body, text, videoLesson, searchWords, uploader, uploaderUserId, notation_format)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let [results] = await this.pool.execute(query, [song.name, song.url, song.body, song.text, song.videoLesson, song.searchWords, song.uploader, song.userId, song.notation_format])

        return results.insertId
    }

    async updateSongToDb(song, id){
        let query = `
            update songs 
            set name = ?, url = ?, body = ?, text = ?, videoLesson = ?, searchWords = ?, uploader = ?, notation_format = ?
            where id = ?
        `;

        await this.pool.execute(query, [song.name, song.url, song.body, song.text, song.videoLesson, song.searchWords, song.uploader, song.notation_format, id])

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

    async hasSeenNewsModal(ip, name) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM news_modal_views WHERE ip = ? AND modal_name = ? AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)',
            [ip, name]
        );

        return rows.length > 0;
    }

    async markNewsModalAsSeen(ip, name) {
        await this.pool.execute(
            'INSERT INTO news_modal_views (ip, modal_name) VALUES (?, ?)',
            [ip, name]
        );
        return true;
    }

    async getTeachers() {
        const [rows] = await this.pool.execute(`
            SELECT 
                t.*,
                ROUND(AVG(tr.rating), 1) as averageRating,
                COUNT(tr.id) as ratingCount
            FROM teachers t
            LEFT JOIN teachers_ratings tr ON t.id = tr.teacher_id
            GROUP BY t.id
            ORDER BY t.created_at DESC
        `);
        return rows;
    }

    async getCities() {
        const [rows] = await this.pool.execute(`
            SELECT DISTINCT city 
            FROM teachers 
            ORDER BY city
        `);
        return rows.map(row => row.city);
    }

    async addTeacher(name, mobile, city, description, userId) {
        const [result] = await this.pool.execute(
            'INSERT INTO teachers (name, mobile, city, description, userId) VALUES (?, ?, ?, ?, ?)',
            [name, mobile, city, description, userId]
        );
        return result.insertId;
    }

    async deleteTeacher(teacherId, userId) {
        const [result] = await this.pool.execute(
            'DELETE FROM teachers WHERE id = ? AND userId = ?',
            [teacherId, userId]
        );
        return result.affectedRows > 0;
    }

    async rateTeacher(teacherId, userId, rating) {
        await this.pool.execute(
            `INSERT INTO teachers_ratings (teacher_id, user_id, rating)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = ?`,
            [teacherId, userId, rating, rating]
        );
        
        // Return updated rating information
        const [avgResult] = await this.pool.execute(
            `SELECT 
                ROUND(AVG(rating), 1) as averageRating,
                COUNT(id) as ratingCount
             FROM teachers_ratings 
             WHERE teacher_id = ?`,
            [teacherId]
        );
        
        return avgResult.length > 0 ? {
            averageRating: avgResult[0].averageRating,
            ratingCount: avgResult[0].ratingCount
        } : { averageRating: 0, ratingCount: 0 };
    }

    async getUserTeacherRating(teacherId, userId) {
        const [rows] = await this.pool.execute(
            'SELECT rating FROM teachers_ratings WHERE teacher_id = ? AND user_id = ?',
            [teacherId, userId]
        );
        return rows.length > 0 ? rows[0].rating : null;
    }

    async getUserSubscription(userId) {
        try {
            const [rows] = await this.pool.execute(`
                SELECT paid_until, payment_confirmed 
                FROM users 
                WHERE id = ?
            `, [userId]);
            
            if (rows.length === 0) {
                return { hasSubscription: false };
            }
            
            const data = rows[0];
            const isSubscriptionValid = data.paid_until && new Date(data.paid_until) > new Date();
            
            return {
                hasSubscription: isSubscriptionValid,
                paidUntil: data.paid_until,
                isConfirmed: data.payment_confirmed,
            };
        } catch (error) {
            console.error('Error getting user subscription:', error);
            return { hasSubscription: false };
        }
    }

    async updateUserSubscription(userId, paymentConfirmed = false) {
        try {
            // Set paid_until to 1 year from now
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            
            const [result] = await this.pool.execute(`
                UPDATE users 
                SET paid_until = ?, payment_confirmed = ? 
                WHERE id = ?
            `, [oneYearFromNow, paymentConfirmed ? 1 : 0, userId]);
            
            return { success: result.affectedRows > 0 };
        } catch (error) {
            console.error('Error updating user subscription:', error);
            return { success: false, error };
        }
    }

    async activateUserSubscription(userId) {
        try {
            // Set paid_until to 1 year from now
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            
            const [result] = await this.pool.execute(`
                UPDATE users 
                SET paid_until = ?, payment_confirmed = 0
                WHERE id = ?
            `, [oneYearFromNow, userId]);
            
            return { success: result.affectedRows > 0 };
        } catch (error) {
            console.error('Error activating user subscription:', error);
            return { success: false, error };
        }
    }

    async incrementSongViewCount(songId) {
        try {
            const [result] = await this.pool.execute(`
                UPDATE songs 
                SET view_count = view_count + 1 
                WHERE id = ?
            `, [songId]);
            
            return { success: result.affectedRows > 0 };
        } catch (error) {
            console.error('Error incrementing song view count:', error);
            return { success: false, error };
        }
    }

    async storeBogPayment(email, status, paymentDetails) {
        // Convert any undefined values to null to avoid SQL errors
        const sanitizedEmail = email === undefined ? null : email;
        const sanitizedStatus = status === undefined ? null : status;
        const sanitizedDetails = paymentDetails === undefined ? null : paymentDetails;
        
        await this.pool.execute('INSERT INTO bog_payments (email, status, bog_body) VALUES (?, ?, ?)', 
            [sanitizedEmail, sanitizedStatus, sanitizedDetails]);
    }

    async storeReport(lineNumber, lineText, songUrl, reportText, ip) {
        const query = `
            INSERT INTO reports (line_number, line_text, song_url, report_text, ip, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;

        const [result] = await this.pool.execute(query, [
            lineNumber, 
            lineText, 
            songUrl, 
            reportText, 
            ip
        ]);

        return result.insertId;
    }

    async getRelatedSongs(songId) {
        try {
            // Get the current song to find related songs with similar authors
            const currentSong = await this.getSongById(songId);
            let authorFilter = '';
            
            if (currentSong && currentSong.authors && currentSong.authors.length > 0) {
                // If the current song has authors, find songs with the same authors
                const authorIdsQuery = `
                    SELECT author_id 
                    FROM authors_songs 
                    WHERE song_id = ?
                `;
                const [authorRows] = await this.pool.execute(authorIdsQuery, [songId]);
                
                if (authorRows.length > 0) {
                    const authorIds = authorRows.map(row => row.author_id);
                    authorFilter = `
                        OR authors_songs.author_id IN (${authorIds.join(',')})
                    `;
                }
            }

            // Get 50 related songs with preference to:
            // 1. Songs by the same author(s)
            // 2. Songs with higher vote counts (likes)
            // 3. Songs with higher view counts
            const [rows] = await this.pool.execute(`
                SELECT 
                    songs.name, 
                    songs.url, 
                    songs.id,
                    songs.notation_format,
                    songs.view_count,
                    songs.videoLesson,
                    IFNULL(authors_agg.authors, "") as authors,
                    IFNULL(votes_count.vote_sum, 0) as vote_sum
                FROM songs
                LEFT JOIN authors_songs ON songs.id = authors_songs.song_id
                LEFT JOIN (
                    SELECT 
                        authors_songs.song_id,
                        GROUP_CONCAT(authors.name) AS authors
                    FROM authors_songs
                    JOIN authors ON authors_songs.author_id = authors.id
                    GROUP BY authors_songs.song_id
                ) AS authors_agg ON songs.id = authors_agg.song_id
                LEFT JOIN (
                    SELECT 
                        song_id,
                        SUM(vote) as vote_sum
                    FROM votes
                    GROUP BY song_id
                ) AS votes_count ON songs.id = votes_count.song_id
                WHERE songs.id != ?
                ${authorFilter}
                GROUP BY songs.id
                ORDER BY 
                    votes_count.vote_sum DESC,
                    songs.view_count DESC
                LIMIT 50
            `, [songId]);

            // Process the author list for each song
            for(let row of rows) {
                row.authors = row.authors ? [...new Set(row.authors.split(","))] : [];
            }

            // Shuffle the array and return 6 random songs
            const shuffledSongs = [...rows].sort(() => 0.5 - Math.random());
            return shuffledSongs.slice(0, 6);
        } catch (error) {
            console.error('Error getting related songs:', error);
            return [];
        }
    }

    async deleteSong(songId) {
        // First delete related records
        // await this.pool.execute('DELETE FROM authors_songs WHERE song_id = ?', [songId]);
        await this.pool.execute('DELETE FROM favorite_songs WHERE song_id = ?', [songId]);
        await this.pool.execute('DELETE FROM votes WHERE song_id = ?', [songId]);
        await this.pool.execute('DELETE FROM difficulties WHERE song_id = ?', [songId]);
        
        // Then delete the song
        const [result] = await this.pool.execute('DELETE FROM songs WHERE id = ?', [songId]);
        
        return result.affectedRows > 0;
    }
}

module.exports = new Db();