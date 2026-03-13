import {NextResponse} from "next/server"

export async function GET(req:Request){

 const {searchParams}=new URL(req.url)
 const code=searchParams.get("code")

 const token=await fetch(
  "https://oauth2.googleapis.com/token",
  {
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({
    client_id:process.env.GOOGLE_CLIENT_ID,
    client_secret:process.env.GOOGLE_CLIENT_SECRET,
    code:code,
    grant_type:"authorization_code",
    redirect_uri:process.env.GOOGLE_REDIRECT
   })
  }
 )

 const data=await token.json()

 return NextResponse.redirect(
  "http://localhost:3000/dashboard?token="+data.access_token
 )

}