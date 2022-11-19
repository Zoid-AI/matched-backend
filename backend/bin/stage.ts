import { StageProps, Stage, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ZoidApi } from "../lib/api";


export class DeployStage extends Stage {

    constructor(scope: Construct, id: string, stageProps?: StageProps) {
        super(scope, id, stageProps);

        const dataStoreStack = new Stack(this, "DataStore");

        const apiStack = new Stack(this, "Api");

        new ZoidApi(apiStack, "ApiGateway");
    }
}