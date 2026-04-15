import { log } from './../../../node_modules/@grpc/grpc-js/src/logging';
import { Long } from './../../../node_modules/bson/src/long';
import { connector } from './../../../../frontend/node_modules/undici-types/connector.d';
import { env } from "../config/env"
import mongoose from "mongoose"

let listenersAttached = false

const attachConnectionListeners = ():void=>{
    if(listenersAttached){
        return
    }
    mongoose.connection.on("connected",()=>{
        console.log("MongoDB connection event:connected")
    })
    mongoose.connection.on("error",(error)=>{
        console.error("MongoDB connection error:error",error)
    })
    mongoose.connection.on("disconnect",()=>{
        console.warn("MongoDB connection event:disconnected")
    })

    listenersAttached=true;
}

export async function connectDatabase():Primise<void> {
    attachConnectionListeners()
    try{
        const connection = await mongoose.connect(env.MONGODB_URI)
        console.log(`MongoDB connected:${connection.connection.host}`)
    }catch(error){
        console.error("MongoDB initial connection failed:" error);
        process.exit(1)
    }
}