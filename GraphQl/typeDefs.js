
import { gql } from 'apollo-server';

export const typeDefs = gql`

    type User {

        id: ID!
        name: String!
        email: String!
        age: Int!
        password:String!
        admin: Boolean!
        blog:[Blog!]

    }
    
    type Userlogin {
        token:String!
        email:String!
    }

  

    input AddUser{
        name: String!
        email: String!
        age: Int!
        password:String!
    }

    input Login{
        email:String!
        password:String!
    }


    input AddBlog{
        title:String!
        description:String!
    }
 
    type Blog{
        id:ID!
        title:String!
        description:String!
        like:[User!]
        owner:User!
    }

    type like{
        id:String!
    }

    input like_id{
        id:ID!
    }

    input upBlog{
        title:String!
        description:String!
    }

    input Postid{
        id:ID!
    }

    type Query{
        users: [User]
        user(id: ID!): User
        useremail(email: String!):User
        # Blog
        blog:[Blog]
    } 

    type Mutation{
        register(user: AddUser!):Userlogin
        login(user: Login):Userlogin
        deletuser:User
        # Blog
        addblog(data:AddBlog):Blog
        addlike(id:like_id):like
        updatepost(post_id:Postid,data:upBlog):Blog
    }

`