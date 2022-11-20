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
        })

        const profileFunction = new PythonFunction(this, "ProfileFunction", {
            entry: join(__dirname, "lambda"),
            index: "profile.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        const profileIntegration = new HttpLambdaIntegration("ProfileIntegration", profileFunction);

        httpApi.addRoutes({
            path: "/profile",
            methods: [HttpMethod.GET],
            integration: profileIntegration
        })

        const loginFunction = new PythonFunction(this, "LoginFunction", {
            entry: join(__dirname, "lambda"),
            index: "login.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        const loginIntegration = new HttpLambdaIntegration("LoginIntegration", loginFunction);

        httpApi.addRoutes({
            path: "/login",
            methods: [HttpMethod.PUT],
            integration: loginIntegration
        })

        const signUpFunction = new PythonFunction(this, "SignUpFunction", {
            entry: join(__dirname, "lambda"),
            index: "sign_up.py",
            runtime: FUNCTION_RUNTIME,
            layers: [layer],
            environment: {
                TABLE_NAME: dataStore.table.tableName
            }
        });
        const signUpIntegration = new HttpLambdaIntegration("SignUpIntegration", signUpFunction);

        httpApi.addRoutes({
            path: "/signUp",
            methods: [HttpMethod.PUT],
            integration: signUpIntegration
        })
    }

}
