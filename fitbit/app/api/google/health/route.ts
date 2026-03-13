import {NextResponse} from "next/server"
import {getGoogleHealth} from "../../../../lib/googlefit"

export async function GET(req:Request){

 const token=req.headers.get("authorization")

 if(!token){
  return NextResponse.json({error:"missing token"})
 }

 const data=await getGoogleHealth(token)

 return NextResponse.json(data)

}