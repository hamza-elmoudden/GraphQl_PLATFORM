import Users from "../mongoose/User.js"
import Blogs from "../mongoose/Blog.js"

const user = new  Users()
const blogs = new Blogs()


export const resolvers = {

    Query:{

        users(){
            return user.Getalluser()   
        },

        user(_,args){

            const finduser = user.Getoneuse(args.id)

            return finduser
        },

        useremail(_,args){
            
            const finduserbyemail = user.Findusebyemail(args.email)

            return finduserbyemail
        },
        // blog
        blog(){
            return blogs.GetallBlog()
        }


    },

    User:{
        blog(parent){
            return blogs.GetBlogbyowner(parent._id)
        }
    },

    Blog:{
       async owner(parent){
            return await user.Getoneuse(parent.owner)
        },

       async like(parent){
        if (parent.like.length <= 0) {
            return [];
        }
    
        const all = [];
    
        for (const element of parent.like) {
          
                const findUser = await user.Getoneuse(element);
                all.push(findUser);
            
        }
    
        return all;
        }
    },
    

    Mutation:{

        async register(_,args){

            const aduser = await user.Register(args.user)
            return aduser
        },

        async login(_,args){

            const login = await user.Login(args.user)
            return login
        },

        async deletuser(_,args,context){

            const deletuser = await user.Deleteuser(context.token)

            return deletuser
        },

        async addblog(_,args,context){
            

            const Blog = await  blogs.AddBlog(args.data,context.token)

            return Blog

        },

        async addlike(_,args,context){
            const id = await blogs.Addlike(args.id.id,context.token)
            return {id}
        },

        async updatepost(_,args,context){
            
            const Blog = await blogs.UpdatePost(args.post_id.id,context.token,args.data)

            return Blog
        }

       


    }
}