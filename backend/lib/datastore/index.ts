import * as ddb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";


export interface IZoidDataStore {
    readonly table: ddb.ITable;
}

export class ZoidDataStore extends Construct implements IZoidDataStore {
    readonly table: ddb.ITable;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const table = new ddb.Table(this, 'Table', {
            partitionKey: {
                name: 'pk',
                type: ddb.AttributeType.STRING
            },
            sortKey: {
                name: 'sk',
                type: ddb.AttributeType.STRING
            },
            timeToLiveAttribute: 'ttl',
            billingMode: ddb.BillingMode.PAY_PER_REQUEST,
            encryption: ddb.TableEncryption.AWS_MANAGED,
        });
        this.table = table;
    }


}