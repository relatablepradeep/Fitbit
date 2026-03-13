import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request){

 const {searchParams} = new URL(request.url)
 const code = searchParams.get("code")

 const token = await axios.post(
  "https://oauth2.googleapis.com/token",
  {
   code,
   client_id:process.env.GOOGLE_CLIENT_ID,
   client_secret:process.env.GOOGLE_CLIENT_SECRET,
   redirect_uri:process.env.GOOGLE_REDIRECT_URI,
   grant_type:"authorization_code"
  }
 )

 const accessToken = token.data.access_token

 return NextResponse.redirect(
  `http://localhost:3000/dashboard?google=${accessToken}`
 )
}