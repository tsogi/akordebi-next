class Db_client{
    async searchSongs(searchText){
        const response = await fetch(`api/searchSongs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchText }),
        });

        const data = await response.json();

        return data;
    }

    async storeSong(data){
        let response = await fetch(`api/storeSong`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return response.json()
    }

    async updateSong(data){
        let response = await fetch(`/api/updateSong`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return response.json()
    }
}

export default new Db_client();