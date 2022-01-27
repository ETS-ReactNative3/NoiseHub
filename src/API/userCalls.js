import { getUser, listUsers } from '../graphql/queries';
import { createUser, updateUser, deleteUser } from '../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

export const create_user = async (user) => {
  try {
    const response = await API.graphql(graphqlOperation(createUser, { input: {
      username: user.username,
      school: user.userSchool,
      noisePref: user.userNoise,
      tempPref: user.userTemp,
      crowdPref: user.userCrowd
    }}))
    return response;
  } catch (error) {
    console.log('Error creating user', error);
  }
}

export const get_user = async (username) => {
  try {
    const user = await API.graphql(graphqlOperation(getUser, {username: username}));
    return user.data.getUser;
  } catch(error) {
    console.log('Error fetching user data', error);
  }
}