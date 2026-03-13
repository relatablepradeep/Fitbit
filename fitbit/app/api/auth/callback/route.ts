import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request) {

 const { searchParams } = new URL(request.url)
 const code = searchParams.get("code")

 const response = await axios.post(
  "https://api.fitbit.com/oauth2/token",
  new URLSearchParams({
   client_id: process.env.FITBIT_CLIENT_ID!,
   grant_type: "authorization_code",
   redirect_uri: process.env.FITBIT_REDIRECT_URI!,
   code: code!
  }),
  {
   headers: {
    Authorization:
     "Basic " +
     Buffer.from(
      process.env.FITBIT_CLIENT_ID +
      ":" +
      process.env.FITBIT_CLIENT_SECRET
     ).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded"
   }
  }
 )

 const token = response.data.access_token

 return NextResponse.redirect(
  `http://localhost:3000/dashboard?token=${token}`
 )
}