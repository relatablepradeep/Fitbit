export default function Home(){

 return(

  <div style={{textAlign:"center",marginTop:"100px"}}>

   <h1>Health Dashboard</h1>

   <a href="/api/auth/login">
    <button>Connect Fitbit</button>
   </a>

   <br/><br/>

   <a href="/api/google/login">
    <button>Connect Google Fit</button>
   </a>

  </div>

 )
}