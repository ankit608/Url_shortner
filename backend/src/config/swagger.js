import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'


const swaggerOptions = {
   defination:{
    openapi : '3.0.0',
    info:{
        title: 'Custon URL Shortnener API',
        version: '1.0.0',
        description:'API documentaion for the Custom Url Shortner with analytic and authentication'
    },
   
    servers: [
        {
            url: 'http://localhost:8080',
            description: 'Local Server'
        }
    ],

   },

  
   apis: ['./routes/*.js'],

   
};

const swaggerDocs = swaggerJSDoc(swaggerOptions)

export default(app) =>{
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}