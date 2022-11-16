import express from "express";
import fs from 'fs';
import admin from 'firebase-admin'
import { db, connectToDb } from './db.js';

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});


const app = express();
app.use(express.json());
// Should be used for post requests. When express receives a json body/payload, it is going to parse it and make it available to us on req.body

// app.post('/hello', (req, res) => {
//     console.log(req.body);
//     res.send(`Hello ${req.body.name}!`);
// });

// // specifying url parameter
// app.get('/hello/:name', (req, res) => {
//     const name =  req.params.name;
//     res.send(`Hello ${name}`)
// });

// use auth token included in every request coming from the front end in order to load information about that user(user id, email etc) from firebase
// we use express middleware to automatically load the user's info whenever we receive a request. does the same thing as express.json(), here is checks for user credentials like auth token
//  we use next callback function, when we are done processing things in the middleware and move on to the route handler
app.use(async (req, res, next) =>{
    const { authtoken } = req.headers;

    if(authtoken){
        try{
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch(e){
            return res.sendStatus(400);
            // bad request -> no auth token -> possible hack
        }
    }

    req.user = req.user || {}; //to access the articles without logging in, i.e., without getting the auth token
    next();
}); //this is how we load the user automatically with the auth token that is included in the headers

app.get('/api/articles/:name', async(req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });
    // articles --> name of the collection.

    if(article){
        const upvoteIds = article.upvoteIds || []; //array of all the users who have already upvoted. the default value is an empty array since we do not have that in our database
        article.canUpvote = uid && !upvoteIds.includes(uid);
        res.json(article);
        // res.json instead of res.send --> so that correct headers are set on the response
    }else{
        res.sendStatus(404);
    }


});

app.use((req, res, next) =>{
    if(req.user){
        next();
    } else {
        res.sendStatus(401);
    }
}); //only logged in user can access that resource

app.put('/api/articles/:name/upvote', async(req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if(article){
        const upvoteIds = article.upvoteIds || []; //array of all the users who have already upvoted. the default value is an empty array since we do not have that in our database
        const canUpvote = uid && !upvoteIds.includes(uid);

        if(canUpvote){                    
            await db.collection('articles').updateOne({ name }, { 
                $inc: { upvotes: 1 },
                $push: { upvoteIds: uid } //adding elements to array in mongo, ids of the user who has already upvoted
            });
            // update property with name as the name in the url parameter
        }

        const updatedArticle = await db.collection('articles').findOne({ name });
        res.json(updatedArticle);
    }else{
        res.send('That article doesn\'t exist.')
    }
})

app.post('/api/articles/:name/comments', async(req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const { email } = req.user;


    await db.collection('articles').updateOne({ name }, { 
        $push: { comments: { postedBy: email, text  } }
     });

    const article = await db.collection('articles').findOne({ name });

    if(article){
        res.json(article);
    }else{
        res.send('That article doesn\'t exist.')
    }
})

connectToDb(() => {
    console.log('Successfully connected to Database.')
    app.listen(8000, () => {
        console.log('Server is listening on port 8000.')
    })
    // args -> route(the specific path it is going to listen for) and a callback that gets called whenever the endpoint receives a request
    
})
