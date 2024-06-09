import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./gpt";
import axios from "axios";

export async function searchYoutube(searchQuery){
    // ai completion => ai+completion 
    searchQuery = encodeURIComponent(searchQuery);
    
    const {data}  = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
    )

    if(!data){
        console.log('youtube fail')
        console.log("FAIL no data")
        return null
    }
    if(data.items[0]== undefined){
        console.log("FAIL")
        console.log('youtube fail')
        return null
    }
    return data.items[0].id.videoId
}

export async function getTranscript(videoId){
    try {
        let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId,{
            lang:'en',
            country:"EN",
        }) 
        let transcript = ''
        for(let t of transcript_arr){
            transcript += t.text+' ';
        }
        return transcript.replaceAll('\n','')
    } catch (error) {
        return ""
    }
}



export async function getQuestionsFromTranscript(transcript, course_title){
    
    const questions = await strict_output(
        "You are a helpful AI assistant that can generate multiple-choice questions and answers",
        `Course Title:${course_title}\n Transcript:${transcript}`,
        "Provide your output in the array of JSON format"

      );

  
      return questions;
    }