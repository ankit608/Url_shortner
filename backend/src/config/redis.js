import {Redis} from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.REDIS_URL)
const redisclient = ()=>{
  
    if(process.env.REDIS_URL){
        console.log('Redis is connected')
         return process.env.REDIS_URL;
    }

    throw new Error('Redis connection failed')


}

export const redisClient = new Redis(redisclient())