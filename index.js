import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4"
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import mongoose from "mongoose";
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
// type
import { typeDefs } from "./GraphQl/typeDefs.js";
import { resolvers } from "./GraphQl/resolvers.js";

dotenv.config()
const port = process.env.PORT || 2300
const app = express()



// Connect MongoDB at default port 27017.
async function connectToMongo() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Paltfrom', {
            // useNewUrlParser: true,
            // useCreateIndex: true,
        });
        console.log('\nMongoDB Connection Succeeded.\n');
        console.log("==================================\n");
    } catch (err) {
        console.error('Error in DB connection:', err);
    }
}

connectToMongo();


// const AppStratServer = async ()=>{
//     const server = new ApolloServer({
//         typeDefs,
//         resolvers,
//         context: ({ req }) => ({
//     req,
//     customHeaders: {
//       headers: {
//         ...req.headers,
//       },
//     },
//   }),       
//     })
//     await server.start()
//     app.use(cors())
//     app.use(express.json())
//     app.use(express.urlencoded({extended:true}))
//     app.use("/graphql",expressMiddleware(server))
//     app.get("/",(req,res)=>{
//         res.send("Hello Wored!")
//     })
//     app.listen(port,()=>{
//         console.log(`Express ready at http://localhost:${port}\n`)
//         console.log(`Graphql ready at http://localhost:${port}/graphql\n`)
//     })
// }
// AppStratServer()



const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const { url } = await startStandaloneServer(server, {
  
  context: async ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || '';

    // add the user to the context
    return { token };
  },
  
});


console.log(`🚀 Server listening at: ${url}`);