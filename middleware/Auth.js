// import  Jwt  from 'jsonwebtoken';
// import { GraphQLError } from 'graphql';
// import Users from '../mongoose/User.js';


// class Auth extends Users  {

//     constructor(){
//     }
//     async  Decode_token({token}){

//         if (!token) {
//             throw new GraphQLError("No token Found")
//           }
//           // Try to verify the token using the secret key defined in the environment variables.
//           try {


//             const decodedToken =  Jwt.verify(token,process.env.KEY);
//             // Find the user in the database using the ID from the decoded token.
//             const user = await this.user.findOne({ _id: decodedToken.Id });
//             // If the user is not found, return a  Unauthorized response.
//             if (!user) {
//               throw new GraphQLError("Unauthorized")
//             }
        
//             return user.id

//           } catch (error) {
//             // The token is invalid or expired.
//             throw new GraphQLError(`message: Unauthorized error: Invalid Token ${error} `)
//           }
//     }
// }

// export default Auth 