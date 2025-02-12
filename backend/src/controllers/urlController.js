import {nanoid} from 'nanoid'
import Url from '../models/url.js'
import Click from '../models/click.js'
import {redisClient} from '../config/redis.js'
import session from "express-session";
import User from '../models/user.js'
import {UAParser} from 'ua-parser-js'
import { Sequelize, where } from 'sequelize';
import { sequelize } from '../config/db.js';
import { raw } from 'express';

//import { json } from 'body-parser'


export const shortenUrl = async (req,res) =>{
    try{
      
        const {longUrl,customAlias,topic} = req.body;
        console.log(req.body)
        const userId = req.user.id;

        let shortUrl = customAlias||nanoid(8);
        const existingUrl = await Url.findOne({where : {shortUrl}});

        if(existingUrl) return res.status(400).json({message:'Custom alias already taken'});

        const newUrl = await Url.create({longUrl, shortUrl , topic , userId});

        await redisClient.set(shortUrl,longUrl);

        res.status(201).json({shortUrl,createdAt: newUrl.createdAt})

    }catch(error){
        console.log(error)
          res.status(500).json({message:'Error in creating the short url'})
    }
}


export const redirectUrl = async (req,res) =>{
   
    try{
        
        const {alias} = req.params;
        console.log(alias)
        let longUrl = await redisClient.get(alias)
        //const userAgent =req.headers['user-agent']
        const parser = new UAParser(req.headers['user-agent']);
        const deviceInfo = parser.getResult();
      
        console.log(deviceInfo.os.name,"info")
        

        if(!longUrl){
            const urlEntry = await Url.findOne({where: {shortUrl: alias}})
            console.log()
            if(!urlEntry)return res.status(404).json({message: 'Short URL not found'}),
               

          
            longUrl = urlEntry.longUrl;
            
            await redisClient.set(alias,longUrl)
        }
         console.log(longUrl,"longurl")
        
        const urlEntry = await Url.findOne({where: {shortUrl: alias}})
        await Click.create({urlId:urlEntry.id, userAgent: req.headers['user-agent'], ipAddress: req.ip, osType:deviceInfo.os.name, deviceType:deviceInfo.device.name});
        res.redirect(longUrl);

    }catch(error){
          console.log(error)
        res.status(500).json({message: 'Error redirecting to the Url'})
    }
}



export const getUrlAnalytics = async (req,res) =>{
    try{

        const {alias} = req.params;
       
        const urlEntry = await Url.findOne({where: {shortUrl: alias}})
        if(!urlEntry) return res.status(500).json({message:"Short Url not found"})
       const clicks = await Click.findAll({where:{urlId:urlEntry.id}})
          console.log(clicks,"hkjhkj")
       const totalClicks = clicks.length;
       const uniqueOsCounts = await Click.findAll({
        attributes: [
          'osType',
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Click.ipAddress'))), 'unique_count']
        ],
        where: { urlId:urlEntry.id },
        group: ['osType'],
        raw: true
      });
      console.log(uniqueOsCounts)
      const uniqueDeviceCounts = await Click.findAll({
        attributes: [
          'deviceType',
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col("ipAddress"))), 'unique_count']
        ],
        where: { urlId:urlEntry.id },
        group: ['deviceType'],
        raw: true
      });
      console.log(uniqueDeviceCounts)

       const unique_user = new Set(clicks.map(c => c.ipAddress)).size
       const clicksByDate = clicks.reduce((acc,click)=>{
        const date = click.clickedAt.toISOString().split('T')[0];
        acc[date] = (acc[date]|| 0)+1;
        return acc;
       },{});
       console.log('Sending response:', { unique_user, clicksByDate });

      return res.status(200).json({unique_user,clicksByDate,uniqueOsCounts,uniqueDeviceCounts})
      console.log('Sending response:fdsf', { unique_user, clicksByDate });

    }catch(Error){
              console.log(Error)
        return res.status(500).json({message:'Error retrieving analytics'})
    }
}


export const getTopicAnalytics = async (req,res)=>{
    try{
        
        const {topic} = req.params;
        console.log(topic,"sfhsdjkfhks")
        const userId = req.user.id
        const urls = await Url.findAll({where:{topic,userId}});

        let totalClicks = 0;
        let uniqueUserSet = new Set()
        let clicksByDate = {};

        for(const url of urls){
            const clicks = await Click.findAll({where:{urlId: url.id}});
            totalClicks+= clicks.length;
            clicks.forEach(c=> uniqueUserSet.add(c.ipAddress))
            clicks.forEach(c=>{
                const formattedDate = new Date(c.clickedAt).toISOString().split('T')[0];
                clicksByDate[formattedDate] = (clicksByDate[formattedDate]||0)+1;
            })
        }

        const urlsData = await Promise.all(
            urls.map(async (url)=>{
                const clicks = await Click.findAll({where:{urlId:url.id}});
                return{
                    shortUrl: url.shortUrl,
                    totalClicks: clicks.length,
                    uniqueUser: new Set(clicks.map((c)=>c.ipAddress)).size
                     
                }
            })
        )
        res.json({totalClicks,uniqueUser:uniqueUserSet.size, clicksByDate,urlsData})

    }catch(error){
        console.log(error)
           res.status(500).json({message:'Error retrieving topic analytics'})
    }
}


export const getOverallAnalytics = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(userId);
  
      // Count total URLs
      const totalUrls = await Url.count({ where: { userId } });
  
     
      const clickstats = await Click.findOne({
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("Click.id")), "totalClicks"], // Fix alias name
          [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("Click.ipAddress"))), "uniqueUsers"] // Fix DISTINCT COUNT
        ],
        include: [{ model: Url, where: { userId }, attributes: [] }],
        raw: true
      });
  
      // Fetch device type statistics
      const deviceType = await Click.findAll({
        attributes: [
          "deviceType",
          [Sequelize.fn("COUNT", Sequelize.col("Click.id")), "totalClicks"],
          [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("Click.ipAddress"))), "uniqueUsers"]
        ],
        include: [{ model: Url, where: { userId }, attributes: [] }],
        group: ["deviceType"],
        raw: true
      });
  
      // Fetch clicks by date
      const clicksByDate = await Click.findAll({
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("Click.createdAt")), "date"], // Fix column reference
          [Sequelize.fn("COUNT", Sequelize.col("Click.id")), "clickCount"]  // Fix COUNT function
        ],
        include: [{ model: Url, where: { userId }, attributes: [] }],
        group: ["date"],
        order: [["date", "ASC"]],
        raw: true
      });
  
      // Fetch OS type statistics
      const osType = await Click.findAll({
        attributes: [
          "osType",
          [Sequelize.fn("COUNT", Sequelize.col("Click.id")), "uniqueClicks"],
          [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("Click.ipAddress"))), "uniqueUsers"]
        ],
        include: [{ model: Url, where: { userId }, attributes: [] }],
        group: ["osType"],
        raw: true
      });
  
      // Return JSON response
      res.json({
        totalUrls,
        totalClicks: clickstats?.totalClicks || 0,
        uniqueUsers: clickstats?.uniqueUsers || 0,
        clicksByDate,
        osType: osType.map((os) => ({
          osName: os.osType || "unknown",
          uniqueClicks: os.uniqueClicks,
          uniqueUsers: os.uniqueUsers
        })),
        deviceType: deviceType.map((device) => ({
          deviceName: device.deviceType || "unknown",
          uniqueClicks: device.uniqueClicks,
          uniqueUsers: device.uniqueUsers
        }))
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving overall analytics" });
    }
  };
  