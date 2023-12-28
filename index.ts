import { 
    SQSEvent, 
    SQSHandler,
    S3EventRecord,
    S3Handler,
    S3Event
} from 'aws-lambda';

import {
    S3Client,
    GetObjectCommandInput,
    GetObjectCommand,
    GetObjectCommandOutput
} from '@aws-sdk/client-s3';

import * as _ from "lodash";

const log = Logger.LoggerManager.create('Test');
const client = new S3Client({ region: "us-east-1" });
const file_name = "sample.xml"
const bucket = "work-us-east-1"

async function getObject(key: string): Promise<GetObjectCommandOutput> {
    // const appId = `${svcName} | getObject`;
    const params: GetObjectCommandInput = {
        Bucket: bucket,
        Key: file_name,
    };
    const command = new GetObjectCommand(params);

    try {
        return await client.send(command);
    } catch (error) {
        log.warn(error.message, { bucket, key }, error);
        throw error;
    }
}

async function getObjectAsString(key: string): Promise<string> {
    try {
        const s3Object = await getObject(key);

        if (!s3Object.Body) {
            throw new Error(`No objectstring found for ${key}, ${bucket}`);
        }

        return await s3Object.Body.transformToString();
    } catch (error) {
        log.error(error.message, { key, bucket }, error);
        throw error;
    }
}


export const handler: S3Handler = async (event: S3Event) => {
    
    try {
        const body = getObjectAsString(file_name);
        console.log(`The file body is:: ${body}`)
    }
    catch (err) {
        log.fatal(err);
        throw err;

    }
};