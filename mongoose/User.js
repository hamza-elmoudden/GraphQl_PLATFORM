import { Schema, model, now } from "mongoose";
import { GraphQLError } from 'graphql';
import bcrypt from "bcrypt"
import  Jwt  from 'jsonwebtoken';
import dotenv from "dotenv"


dotenv.config()

const userschema = new Schema({
    name:{
        type:String,
        default:"Name",
        required:true,
        lowercase:true,
        minLength:2,
        maxLength:255,
        trim:true 
    },

    email:{
        type:String,
        required:true,
        lowercase:true,
        minLength:2,
        maxLength:255,
        trim:true 
    },

    age:{
        type:Number,
        default:18,
        min:18,
        max:200,
    },

    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:1024,
    },

    admin:{
        type:Boolean,
        default:false
    }

})

userschema.methods.Generate_token = async function(){
    const token = Jwt.sign({ Id: this._id}, process.env.KEY)
    return  token
  }

class Users {
    constructor(){
        this.user = model("User", userschema) || model("User")
    }

    
    async Getalluser(){
        const user = await this.user.find()
        return user
    }

    async Getoneuse(id){
        const user = await this.user.findOne({
            "_id":id
        })

        return user
    }

    async Findusebyemail(email){
        let user = await this.user.findOne({
            "email":email
        })

        return user
    } 

    async Register({name,email,age,password}){
        let user = await this.Findusebyemail(email)

        if(user){
                throw new GraphQLError('The user already existe', {

                extensions: {
              
                  code: 'FORBIDDEN',
              
                },
              
              });
        }

        const salt = bcrypt.genSaltSync(8);
        password = bcrypt.hashSync(password, salt);
        

         user = await this.user({
            name,
            email,
            age,
            password
        })

        await user.save()

        user.token = await user.Generate_token()

        return user
    }

    async Login({email,password}){
        let user = await this.Findusebyemail(email)
     

        if(!user || !password){
            throw new GraphQLError('The user or password Not existe', {

                extensions: {
              
                  code: 'FORBIDDEN',
              
                },
              
              });
        }

        if(!bcrypt.compareSync(password,user.password)){
            throw new GraphQLError("The user or password Not True")
        }

        
        user.token = await user.Generate_token()

        return user
        

    }

    async  Decode_token(token){
        
        if (!token) {
            throw new GraphQLError("No token Found")
          }
          // Try to verify the token using the secret key defined in the environment variables.
          try {


            const decodedToken =  Jwt.verify(token,process.env.KEY);
            // Find the user in the database using the ID from the decoded token.
            const user = await this.user.findOne({ _id: decodedToken.Id });
            // If the user is not found, return a  Unauthorized response.
            if (!user) {
              throw new GraphQLError("Unauthorized")
            }
        
            return user.id

          } catch (error) {
            // The token is invalid or expired.
            throw new GraphQLError(`message: Unauthorized error: Invalid Token ${error} `)
          }
    }

    async Deleteuser(token){

        const id = await this.Decode_token(token)
        const user = await this.user.findOneAndDelete({"_id":id})

        return  user

    }

}


export default Users