import { getSpace, listSpaces } from '../graphql/queries';
import { createSpace, updateSpace, deleteSpace } from '../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

export const create_space = async (space) => {
  try {
    const response = await API.graphql(graphqlOperation(createSpace, { input: {
      uuid: space.uuid,
      name: space.name,
      location: space.location,
      hours: space.hours,
      amenities: space.amenities,
      noiseLevel: space.noiseLevel,
      busyLevel: space.busyLevel,
      tempLevel: space.tempLevel,
      userFeedback: space.userFeedback,
      graphData: space.graphData,
      correction: space.correction,
      headRange: space.headRange
    }}))
    return response;
  } catch (error) {
    console.log('Error creating space', error);
  }
}

export const update_space  = async (space) => {
  try {
    const response = await API.graphql(graphqlOperation(updateSpace, { input: {
      uuid: space.uuid,
      name: space.name,
      location: space.location,
      hours: space.hours,
      amenities: space.amenities,
      noiseLevel: space.noiseLevel,
      busyLevel: space.busyLevel,
      tempLevel: space.tempLevel,
      userFeedback: space.userFeedback,
      graphData: space.graphData,
      correction: space.correction,
      headRange: space.headRange
    }}))
    return response;
  } catch (error) {
    console.log('Error creating space', error);
  }
}

export const get_space = async (uuid) => {
  try {
    const response = await API.graphql(graphqlOperation(getSpace, {uuid: uuid}));
    return response.data.getSpace;
  } catch(error) {
    console.log('Error fetching user data', error);
  }
}



// Example
// const value = {
//     uuid: "uuid",
//     name: "name",
//     location: "location",
//     hours: "hours",
//     amenities: "amenities",
//     noiseLevel: "noiseLevel",
//     busyLevel: "busyLevel",
//     tempLevel: "tempLevel",
//     userFeedback: "userFeedback",
//     graphData: "graphData"
//   }

//   const response_1 = spaceCalls.create_space(value);