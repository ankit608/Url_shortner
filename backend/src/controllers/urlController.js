import {nanoid} from 'nanoid'
import Url from '../models/url.js'
import Click from '../models/click.js'
import {redisClient} from '../config/redis.js'

export const shortenUrl = async (req,res) =>{
    try{
      
        const {longUrl,customAlias,topic} = req.body;
        const userId = req.user.id;

        let shortUrl = customAlias||nanoid(8);
        const existingUrl = await Url.findOne({where : {shortUrl}});

        if(existingUrl) return res.status(400).json({message:'Custom alias already taken'});

        const newUrl = await Url.create({longUrl, shortUrl , topic , userId});

        await redisClient.set(shortUrl,longUrl);

        res.status(201).json({shortUrl,createdAt: newUrl.createdAt})

    }catch(error){
          res.status(500).json({message:'Error in creating the short url'})
    }
}


export const redirectUrl = async (req,res) =>{
    try{
        
        const {alias} = req.params;
        let longUrl = await redisClient.get(alias)

        if(!longUrl){
            const urlEntry = await Url.findOne({where: {shortUrl: alias}})
            if(!urlEntry)return res.status(404).json({message: 'Short URL not found'}),
               

            
            longUrl = urlEntry.longUrl;
            await redisClient.set(alias,longUrl)
        }

        await Click.create({urlId:alias, userAgent: req.headers['user-agent'], ipAddress: req.ip});
        res.redirec(longUrl);

    }catch(error){
          
        res.status(500).json({message: 'Error redirecting to the Url'})
    }
}



export const getUrlAnalytics = async (req,res) =>{
    try{

        const {alias} = req.params;
       const clicks = await Click.findAll()

    }catch(Error){

    }
}