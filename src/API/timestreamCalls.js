import { TimestreamQuery, QueryCommand } from "@aws-sdk/client-timestream-query";
import { Auth } from 'aws-amplify'
// Specified here - https://github.com/aws/aws-sdk-js-v3#getting-started - https://github.com/aws/aws-sdk-js-v3/issues/2288
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

async function formatNoiseData(input) {
  // console.log(input);
  let data = []
  for (let i=0; i<input['Rows'].length; i++) {
    let row = input['Rows'][i]['Data'];
    let obj = {
      temp: row[0]['ScalarValue'],
      noise: row[1]['ScalarValue'],
      time: row[3]['ScalarValue']
    }
    data.push(obj);
  }
  return data;
}

async function formatDoorData(input) {
  let data = []
  for (let i=0; i<input['Rows'].length; i++) {
    let row = input['Rows'][i]['Data'];
    let obj = {
      head: row[0]['ScalarValue'].replace(/{|}/g, ''),
      temp: row[1]['ScalarValue'].replace(/{|}/g, ''),
      time: row[3]['ScalarValue']
    }
    data.push(obj);
  }
  return data;
}

export const getTimeStreamData = async () => {
  console.log("HERE");
  let result = {};
  const region = "us-east-2";

  const credentials = await Auth.currentCredentials();

  const endpointsQueryClient = new TimestreamQuery({ 
    region,
    credentials: credentials,
  });

  const qClientResponse = await endpointsQueryClient.describeEndpoints({});

  const queryClient = new TimestreamQuery({
    region,
    endpoint: `https://${qClientResponse.Endpoints[0].Address}`,
    credentials: credentials,
  });

  const DatabaseName = 'noisehub-timestream';
  const NoiseTempTable = 'noise_temp_table';
  const Doortable = 'door_table'
  const NoiseTempQueryString = `SELECT * FROM "${DatabaseName}"."${NoiseTempTable}" ORDER BY time DESC LIMIT 5`;
  const DoorQueryString = `SELECT * FROM "${DatabaseName}"."${Doortable}" ORDER BY time DESC LIMIT 1`;
  // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" ORDER BY time DESC LIMIT 1000000000000000000`;
  // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" WHERE time between ago(15m) and now() ORDER BY time DESC LIMIT 10`;
  // console.log(await queryClient.query({ QueryString })); // Also a valid way to query
  const NoiseTempCommand = new QueryCommand({QueryString: NoiseTempQueryString})
  const DoorTableCommand = new QueryCommand({QueryString: DoorQueryString})

  const NoiseTempData_ts = await queryClient.send(NoiseTempCommand);  
  const DoorData_ts = await queryClient.send(DoorTableCommand);

  const noiseTempData = await formatNoiseData(NoiseTempData_ts);
  const doorData = await formatDoorData(DoorData_ts);

  return {noise_temp: noiseTempData, door: doorData};
}

/* ts_data Format
{
  noise_temp: [{
    temp: #,
    noise: #,
    time: #
  }]
  door: [{
    head: #,
    temp: #,
    time: #
  }]
}
*/
