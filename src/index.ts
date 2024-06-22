import express from 'express';
import cluster from 'cluster';
import os from 'os';
import {Request,Response} from 'express';


const PORT = process.env.PORT || 3000;



const numCPUs = os.cpus().length - 2;

if(cluster.isPrimary){
    console.log(`Primary ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers`);

    for(let i=0;i< numCPUs; i++){
        cluster.fork();}
    
    cluster.on('exit', (worker:any, code:any, signal:any) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log(`forking new worker`);
        cluster.fork();

    })
}else{
    const app = express();

console.log(`worker ${process.pid} started`);
app.get("/",(req:Request,res:Response)=>{

    res.send(`Hello from worker ${process.pid}`)
})

app.listen(PORT,()=>console.log(`listening worker ${process.pid} on port ${PORT}`))
}
