import { Auth } from "aws-amplify";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
// Specified here - https://github.com/aws/aws-sdk-js-v3#getting-started - https://github.com/aws/aws-sdk-js-v3/issues/2288
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

export const invokeLambda = () => {
  console.log("INVOKING LAMBDA");
  Auth.currentCredentials().then(async (credentials) => {
    const params = {
      FunctionName: "noisehub_data_analysis",
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: "",
    };
    const REGION = "us-east-2";
    const client = new LambdaClient({
      region: REGION,
      credentials: credentials,
    });
    const response = await client.send(new InvokeCommand(params));
  });
}