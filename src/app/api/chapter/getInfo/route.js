import { prisma } from "@/lib/db"
import { strict_output } from "@/lib/gpt"
import { getQuestionsFromTranscript, getTranscript, searchYoutube } from "@/lib/youtube"
import { NextResponse } from "next/server"
import { z } from "zod"


const bodyParser = z.object({
    chapterId: z.string()
})

export async function POST(req,res){
    try{
        const body = await req.json()
        const {chapterId}  = bodyParser.parse(body)
        
        // fetch chapter to get its youtube search query
        const chapter = await prisma.chapter.findUnique({
            where:{
                id:chapterId,

            }
        });
        
        if(!chapter){
            return NextResponse.json({
                success:false,
                 error:"Chapter not found",
            },{status:404})
        }


        const videoId = await searchYoutube(chapter.youtubeSearchQuery);
        
        let transcript = await getTranscript(videoId);
       
            
        let transcript_arr = transcript.split(" ")
        
        let maxLength = Math.min(250,transcript_arr.length)
        
        let sliced_transcript = transcript_arr.slice(0,maxLength).join(' ')
    
        await prisma.chapter.update({
            where: { id: chapterId },
            data: {
              videoId: videoId
            },
          });
          try {
            
        const {summary} = await strict_output(
            "You are an AI capable of summarising a youtube transcript in maximum 250 words",
            `transcript: + ${sliced_transcript}`,
            `Provide your output in the following JSON format:
            {
                "summary": "summary of the transcript"
            }`
        );
        await prisma.chapter.update({
            where: { id: chapterId },
            data: {
              summary: summary,
            },
          });
        const questions = await getQuestionsFromTranscript(sliced_transcript,chapter.name);
        
        await prisma.question.createMany({
            data: questions.map((question) => {
              let options = [
                question.answer,
                question.option1,
                question.option2,
                question.option3,
              ];
              
              console.log(options)
              options = options.sort(() => Math.random() - 0.5);
              return {
                question: question.question,
                answer: question.answer,
                options: JSON.stringify(options),
                chapterId: chapterId,
              };
            }),
          });
        } catch (questionsError) {
            console.error("Error fetching or storing questions or summary:", questionsError);
        }
      


        return NextResponse.json({success:true })

    }catch(error){
        if (error instanceof z.ZodError){
            return NextResponse.json({
                success:false,
                error:"Invalid body"
            },{status:400})
        }
        else{
            return NextResponse.json({
                success:false,
                error:error.message
            },{status:500})
        }
    }
}