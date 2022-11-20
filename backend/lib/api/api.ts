import { Construct } from "constructs";
import { HttpApi, CorsHttpMethod, IHttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha"
import { Duration } from "aws-cdk-lib";
import { IZoidDataStore } from "../datastore";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { PythonFunction, PythonLayerVersion } from "@aws-cdk/aws-lambda-python-alpha";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

export interface IZoidApi {
    readonly httpApi: IHttpApi
}

/**
 * Make sure that function runtime is compatible with Lambda Layer,
 * as Lambda Layer only supports Python 3.7
 */
export const FUNCTION_RUNTIME = Runtime.PYTHON_3_7;

export class ZoidApi extends Construct implements IZoidApi {
    readonly httpApi: IHttpApi;

    constructor(scope: Construct, id: string, dataStore: IZoidDataStore) {
        super(scope, id);

        const httpApi = new HttpApi(this, "HttpApi", {
            corsPreflight: {
                allowMethods: [
                    CorsHttpMethod.GET,
                    CorsHttpMethod.HEAD,
                    CorsHttpMethod.OPTIONS,
                    CorsHttpMethod.POST,
                ],
                allowOrigins: ['*'],
                maxAge: Duration.days(10),
            },
        });
        this.httpApi = httpApi;

        const layer = new PythonLayerVersion(this, "Layer", {
            entry: join(__dirname, "layer"),
            compatibleRuntimes: [FUNCTION_RUNTIME],

        });

        const helloFunction = new PythonFunction(this, "HelloFunction", {
            entry: join(__dirname, "lambda"),
            index: "hello.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(helloFunction);
        const helloIntegration = new HttpLambdaIntegration("HelloIntegration", helloFunction);

        httpApi.addRoutes({
            path: "/hello",
            methods: [HttpMethod.GET],
            integration: helloIntegration
        });

        const searchFunction = new PythonFunction(this, "SearchFunction", {
            entry: join(__dirname, "lambda"),
            index: "search.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(searchFunction);
        const searchIntegration = new HttpLambdaIntegration("SearchIntegration", searchFunction);

        httpApi.addRoutes({
            path: "/search",
            methods: [HttpMethod.GET],
            integration: searchIntegration
        });


        const requestFunction = new PythonFunction(this, "RequestFunction", {
            entry: join(__dirname, "lambda"),
            index: "request.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(requestFunction);
        const requestIntegration = new HttpLambdaIntegration("RequestIntegration", requestFunction);

        httpApi.addRoutes({
            path: "/request",
            methods: [HttpMethod.POST],
            integration: requestIntegration
        });

        const editProfileFunction = new PythonFunction(this, "EditProfileFunction", {
            entry: join(__dirname, "lambda"),
            index: "editProfile.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(editProfileFunction);
        const editProfileIntegration = new HttpLambdaIntegration("EditProfileIntegration", editProfileFunction);

        httpApi.addRoutes({
            path: "/editProfile", //Update this line
            methods: [HttpMethod.PUT],
            integration: editProfileIntegration
        });

        const acceptFunction = new PythonFunction(this, "AcceptFunction", {
            entry: join(__dirname, "lambda"),
            index: "accept.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(acceptFunction);
        const acceptIntegration = new HttpLambdaIntegration("AcceptIntegration", acceptFunction);

        httpApi.addRoutes({
            path: "/accept", //Update this line
            methods: [HttpMethod.POST],
            integration: acceptIntegration
        });

        const refuseFunction = new PythonFunction(this, "RefuseFunction", {
            entry: join(__dirname, "lambda"),
            index: "refuse.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(refuseFunction);
        const refuseIntegration = new HttpLambdaIntegration("RefuseIntegration", refuseFunction);

        httpApi.addRoutes({
            path: "/refuse", //Update this line
            methods: [HttpMethod.DELETE],
            integration: refuseIntegration
        });

        const getMenteeFunction = new PythonFunction(this, "GetMenteeFunction", {
            entry: join(__dirname, "lambda"),
            index: "getMentee.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(getMenteeFunction);
        const getMenteeIntegration = new HttpLambdaIntegration("GetMenteeIntegration", getMenteeFunction);

        httpApi.addRoutes({
            path: "/profile/getMentee", //Update this line
            methods: [HttpMethod.GET],
            integration: getMenteeIntegration
        });

        const getMentorFunction = new PythonFunction(this, "GetMentorFunction", {
            entry: join(__dirname, "lambda"),
            index: "getMentor.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        dataStore.table.grantReadWriteData(getMentorFunction);
        const getMentorIntegration = new HttpLambdaIntegration("GetMentorIntegration", getMentorFunction);

        httpApi.addRoutes({
            path: "/profile/getMentor", //Update this line
            methods: [HttpMethod.GET],
            integration: getMentorIntegration
        });
    }

}