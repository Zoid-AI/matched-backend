import { StageProps, Stage, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ZoidApi } from "../lib/api";
import { ZoidDataStore } from "../lib/datastore";


export class DeployStage extends Stage {

    constructor(scope: Construct, id: string, stageProps?: StageProps) {
        super(scope, id, stageProps);

        const dataStoreStack = new Stack(this, "DataStore");

        const matchedDataStore = new ZoidDataStore(dataStoreStack, "MatchedDataStore");
        const apiStack = new Stack(this, "Api");

        new ZoidApi(apiStack, "Api", matchedDataStore);
    }
}