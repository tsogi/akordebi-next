class Db_client{
    async getSong(songId){
        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/getSong/${songId}`);

        return response.json();
    }

    async getAllSongs(){
        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/getAllSongs`);

        return response.json();
    }

    async searchSongs(searchText){
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/searchSongs`, {
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
        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/storeSong`, {
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