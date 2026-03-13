import { NextResponse } from "next/server"

export async function GET() {

 const clientId = process.env.FITBIT_CLIENT_ID
 const redirect = encodeURIComponent(
  process.env.FITBIT_REDIRECT_URI!
 )

 const scope = encodeURIComponent(
  "activity heartrate sleep profile nutrition weight"
 )

 const url =
 `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&scope=${scope}`

 return NextResponse.redirect(url)
}