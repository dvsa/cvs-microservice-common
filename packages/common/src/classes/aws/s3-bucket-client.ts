import {
  S3Client,
  GetObjectCommand,
  GetObjectRequest,
  GetObjectCommandOutput,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';
import * as AWSxRay from 'aws-xray-sdk';

export class S3Storage {
  private static readonly defaultConfig: Partial<S3ClientConfig> = {
    region: 'eu-west-1',
  };

  /**
   * Get an S3 client
   * @param {Partial<S3ClientConfig>} config - The S3 configuration object.
   * @return {S3Client}
   */
  static getClient(config: Partial<S3ClientConfig> = S3Storage.defaultConfig): S3Client {
    if (process.env.USE_CREDENTIALS === 'true') {
      config.credentials = fromIni();
    }

    console.warn(
      'The AWS utils from "@dvsa/cvs-microservice-common" is soon to be deprecated. Please migrate "@dvsa/aws-utils" package instead.'
    );

    // If tracing is enabled, then capture the client with AWS X-Ray
    return process.env._X_AMZN_TRACE_ID
      ? AWSxRay.captureAWSv3Client(new S3Client(config))
      : new S3Client(config);
  }

  /**
   * Download method to retrieve an object from an AWS S3 bucket.
   * - If process.env.USE_CREDENTIALS is true, credentials will be used from ~/.aws/credentials
   * @param {GetObjectRequest} params - The parameters to send to the operation.
   * @param {Partial<S3ClientConfig>} config - The S3 configuration object.
   * @returns {Promise<GetObjectCommandOutput>}
   */
  static async download(
    params: GetObjectRequest,
    config: Partial<S3ClientConfig> = S3Storage.defaultConfig
  ): Promise<GetObjectCommandOutput> {
    return this.getClient(config).send(new GetObjectCommand(params));
  }
}
