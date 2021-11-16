import { getUser, listUsers } from '../graphql/queries';
import { createUser, updateUser, deleteUser } from '../graphql/mutations';
import { getUser, listUsers } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify';

// export const creatre_user = async username => {
//   try {
//     const user = await API.graphql(graphqlOperation(getUser, {username: username}));
//     return user.data.getUser;
//   } catch(error) {
//     console.log('Error fetching user data', error);
//   }
// }

export const get_user = async username => {
  try {
    const user = await API.graphql(graphqlOperation(getUser, {username: username}));
    return user.data.getUser;
  } catch(error) {
    console.log('Error fetching user data', error);
  }
}