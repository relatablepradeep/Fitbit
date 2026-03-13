import { NextResponse } from "next/server"

export async function GET(){

 const redirect = encodeURIComponent(
  process.env.GOOGLE_REDIRECT_URI!
 )

 const scope = encodeURIComponent(
  "https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.oxygen_saturation.read"
 )

 const url =
 `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirect}&scope=${scope}&access_type=offline`

 return NextResponse.redirect(url)
}