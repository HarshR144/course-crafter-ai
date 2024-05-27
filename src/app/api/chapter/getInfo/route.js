import { strict_output } from "@/lib/gpt"
import { getTranscript, searchYoutube } from "@/lib/youtube"
import { NextResponse } from "next/server"
import { z } from "zod"

const sleep = async ()=> new Promise((resolve)=>{
    setTimeout(resolve, Math.random()*4000)
})

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
        let maxLength = 250
        transcript = transcript.split(' ').slice(0,maxLength).join(' ')

        const {summary} = await strict_output(
            "You are an AI capable of summarising a youtube transcript",
            "summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" + transcript,
            { summary: "summary of the transcript" }
        );

        const questions = await getQuestionsFromTranscript(transcript,chapter.name);

        await prisma.questions.createMany({
            data:questions.map((question)=>{
                let options = [question.option1, question.option1, question.option2, question.option3]
                options.sort(()=>Math.random()-0.5)
                return {
                question:question.question,
                answer:question.answer,
                options:JSON.stringify(options),
                chapterId:chapterId
             }   
            })
        })

        await prisma.chapter.update({
            data:{
                videoId:videoId,
                summary:summary,
            }
        })


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
                error:"Something went wrong"
            },{status:500})
        }
    }
}