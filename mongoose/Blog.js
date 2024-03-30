import mongoose, { Schema, model, now } from "mongoose";
import { GraphQLError } from 'graphql';
import dotenv from "dotenv"
import Users from "./User.js";

dotenv.config()

const blogschema = new Schema({
    
    title:{
        type:String,
        default:"title Bloge",
        required:true,
        lowercase:true,
        minLength:2,
        maxLength:255,
        trim:true 
    },

    description:{
        type:String,
        required:true,
        lowercase:true,
        minLength:2,
        maxLength:255,
        trim:true 
    },

    like:[{
        type:mongoose.Types.ObjectId,
        ref:"User",
        minLength:5,
        maxLength:255,
    }],

 

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        trim:true,
        minLength:5,
        maxLength:255,
        require:true
    }

})


class Blogs extends Users{
    constructor(){
        super(),
        this.blog = model("Blog",blogschema) || model("Blog") 
    }

    async AddBlog(blog,token){
        const id =  await this.Decode_token(token)
        const post = await this.blog({...blog,owner:id})

        if(!post){
            new GraphQLError("Error in Add Post")
        }

        await post.save()
        return post
    }

    async GetBlogbyid(id){
        
        const blog = await this.blog.find({
            "_id":id
        })

        return blog[0]
    }
    async GetBlogbyowner(id){
        const blog = await this.blog.find({
            "owner":id
        })

        return blog
    }

    async GetallBlog(){
        const blog = await this.blog.find({})

        return blog
    }

    async Addlike(post_id,token){

        const user_id = await this.Decode_token(token)
        const post = await this.blog.findOne({
            "_id":post_id
        })

        if(!post){
            throw GraphQLError("Post Not Found")
        }

        if (Array.isArray(post.like) && post.like.length > 0) {
            const userLikedIndex = post.like.indexOf(user_id); 
            if (userLikedIndex !== -1) { 
                post.like.splice(userLikedIndex, 1); 
            } else {
                post.like.push(user_id); 
            }
        } else {
            post.like = [...post.like,user_id]; 
        }

       await post.save()

       return  user_id
    }

    async UpdatePost(post_id,token,data){
        const user_id = await this.Decode_token(token)
        const post = await this.blog.findOne({
            "_id":post_id
        })


        if(!post){
            throw GraphQLError("Post Not Found")
        }

        if(user_id != post.owner){
            throw GraphQLError("You Not the Owner to this Post")
        }

        
        await post.updateOne({...data})

        return await this.GetBlogbyid(post_id)
    }
    
    
}




export default Blogs