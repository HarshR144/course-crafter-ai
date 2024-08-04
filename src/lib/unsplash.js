import axios from "axios"

export const getUnsplashImage = async (query)=>{
    try {
        const {data} = await axios.get(`
            https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.UNSPLASH_API_KEY}
            `);
            return data.results[0].urls.small_s3;    
    } catch (error) {
        console.log("Error while getting image using unsplash: ",error.message);
    }
    

}