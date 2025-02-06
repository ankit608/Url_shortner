import {nanoid} from 'nanoid'
import Url from '../models/url.js'
import Click from '../models/click.js'
import {redisClient} from '../config/redis.js'

import { json } from 'body-parser'

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
       const clicks = await Click.findAll({where:{urlId:alias}})

       const totalClicks = clicks.length;
       const unique_user = new Set(clicks.map((c)=>{c.ipAddress})).size
       const clicksByDate = clicks.reduce((acc,click)=>{
        const date = click.clickedAt.toISOString().split('T')[0];
        acc[date] = (acc[date]|| 0)+1;
        return acc;
       },{});

       res.json({totalClicks,unique_user,clicksByDate})

    }catch(Error){
              
        res.status(500).json({message:'Error retrieving analytics'})
    }
}


export const getTopicAnalytics = async (req,res)=>{
    try{
        
        const {topic} = req.params;
        const urls = await Url.findAll({where:{topic}});

        let totalClicks = 0;
        let uniqueUserSet = new Set()
        let clicksByDate = {};

        for(const url of urls){
            const clicks = await Click.findAll({where:{urlId: url.id}});
            totalClicks+= clicks.length;
            clicks.forEach(c=> uniqueUserSet.add(c.ipAddress))
            clicks.forEach(c=>{
                const date = c.clickedAt.toISOString.split('T')[0];
                clicksByDate[date] = (clicksByDate[date]||0)+1;
            })
        }
        res.json({totalClicks,uniqueUser:uniqueUserSet.size, clicksByDate})

    }catch(error){
           res.status(500),json({message:'Error retrieving topic analytics'})
    }
}


export const getOverallAnalytics = async(req,res)=>{
   try{
    const userId = req.user.id;
    const urls = await Url.findAll({where:{userId}})
    let totalClicks = 0;
    let uniqueUserSet = new Set()
    let clicksByDate = {}

    for(const url of urls){
        const clicks = await Click.findAll({where: {urlId: url.id}});
        totalClicks += clicks.length;
        clicks.forEach(c=>uniqueUserSet.add(c.ipAddress));
        clicks.forEach(c =>{
            const date = c.clickedAt.toISOString().split('T')[0];
             clicksByDate[date] = (clicksByDate[date] || 0)+1

            
        })
    }

    res.json({totalUrls:urls.length, totalClicks, uniqueUser:uniqueUserSet.size, clicksByDate});

   }catch(error){

    res.status(500).json({message:'Error retrieving overall analytics'})
   }
   


}