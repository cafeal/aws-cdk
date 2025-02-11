import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IDatabaseCluster } from './cluster';
import { Endpoint } from './endpoint';
import { CfnDBInstance } from 'aws-cdk-lib/aws-neptune';
import { IParameterGroup } from './parameter-group';

/**
 * Possible Instances Types to use in Neptune cluster
 * used for defining `DatabaseInstanceProps.instanceType`.
 */
export class InstanceType {

  /**
   * db.r6g.large
   */
  public static readonly R6G_LARGE = InstanceType.of('db.r6g.large');

  /**
   * db.r6g.xlarge
   */
  public static readonly R6G_XLARGE = InstanceType.of('db.r6g.xlarge');

  /**
   * db.r6g.2xlarge
   */
  public static readonly R6G_2XLARGE = InstanceType.of('db.r6g.2xlarge');

  /**
   * db.r6g.4xlarge
   */
  public static readonly R6G_4XLARGE = InstanceType.of('db.r6g.4xlarge');

  /**
   * db.r6g.8xlarge
   */
  public static readonly R6G_8XLARGE = InstanceType.of('db.r6g.8xlarge');

  /**
  * db.r6g.12xlarge
  */
  public static readonly R6G_12XLARGE = InstanceType.of('db.r6g.12xlarge');

  /**
   * db.r6g.16xlarge
   */
  public static readonly R6G_16XLARGE = InstanceType.of('db.r6g.16xlarge');

  /**
   * db.t4g.medium
   */
  public static readonly T4G_MEDIUM = InstanceType.of('db.t4g.medium');

  /**
   * db.r5.large
   */
  public static readonly R5_LARGE = InstanceType.of('db.r5.large');

  /**
   * db.r5.xlarge
   */
  public static readonly R5_XLARGE = InstanceType.of('db.r5.xlarge');

  /**
   * db.r5.2xlarge
   */
  public static readonly R5_2XLARGE = InstanceType.of('db.r5.2xlarge');

  /**
   * db.r5.4xlarge
   */
  public static readonly R5_4XLARGE = InstanceType.of('db.r5.4xlarge');

  /**
   * db.r5.8xlarge
   */
  public static readonly R5_8XLARGE = InstanceType.of('db.r5.8xlarge');

  /**
   * db.r5.12xlarge
   */
  public static readonly R5_12XLARGE = InstanceType.of('db.r5.12xlarge');

  /**
   * db.r5.24xlarge
   */
  public static readonly R5_24XLARGE = InstanceType.of('db.r5.24xlarge');

  /**
   * db.r4.large
   */
  public static readonly R4_LARGE = InstanceType.of('db.r4.large');

  /**
   * db.r4.xlarge
   */
  public static readonly R4_XLARGE = InstanceType.of('db.r4.xlarge');

  /**
   * db.r4.2xlarge
   */
  public static readonly R4_2XLARGE = InstanceType.of('db.r4.2xlarge');

  /**
   * db.r4.4xlarge
   */
  public static readonly R4_4XLARGE = InstanceType.of('db.r4.4xlarge');

  /**
   * db.r4.8xlarge
   */
  public static readonly R4_8XLARGE = InstanceType.of('db.r4.8xlarge');

  /**
   * db.t3.medium
   */
  public static readonly T3_MEDIUM = InstanceType.of('db.t3.medium');

  /**
   * Build an InstanceType from given string or token, such as CfnParameter.
   */
  public static of(instanceType: string): InstanceType {
    return new InstanceType(instanceType);
  }

  /**
   * @internal
   */
  readonly _instanceType: string;

  private constructor(instanceType: string) {
    if (cdk.Token.isUnresolved(instanceType) || instanceType.startsWith('db.')) {
      this._instanceType = instanceType;
    } else {
      throw new Error(`instance type must start with 'db.'; (got ${instanceType})`);
    }
  }
}

/**
 * A database instance
 */
export interface IDatabaseInstance extends cdk.IResource {
  /**
   * The instance identifier.
   */
  readonly instanceIdentifier: string;

  /**
   * The instance endpoint.
   */
  readonly instanceEndpoint: Endpoint;

  /**
   * The instance endpoint address.
   *
   * @attribute Endpoint
   */
  readonly dbInstanceEndpointAddress: string;

  /**
   * The instance endpoint port.
   *
   * @attribute Port
   */
  readonly dbInstanceEndpointPort: string;

  /**
   * Return the given named metric associated with this database instance
   *
   * @see https://docs.aws.amazon.com/neptune/latest/userguide/cw-metrics.html
   * @see https://docs.aws.amazon.com/neptune/latest/userguide/cw-dimensions.html
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Properties that describe an existing instance
 */
export interface DatabaseInstanceAttributes {
  /**
   * The instance identifier.
   */
  readonly instanceIdentifier: string;

  /**
   * The endpoint address.
   */
  readonly instanceEndpointAddress: string;

  /**
   * The database port.
   */
  readonly port: number;
}

/**
 * Construction properties for a DatabaseInstanceNew
 */
export interface DatabaseInstanceProps {
  /**
   * The Neptune database cluster the instance should launch into.
   */
  readonly cluster: IDatabaseCluster;

  /**
   * What type of instance to start for the replicas
   */
  readonly instanceType: InstanceType;

  /**
   * The name of the Availability Zone where the DB instance will be located.
   *
   * @default - no preference
   */
  readonly availabilityZone?: string;

  /**
   * A name for the DB instance. If you specify a name, AWS CloudFormation
   * converts it to lowercase.
   *
   * @default - a CloudFormation generated name
   */
  readonly dbInstanceName?: string;

  /**
   * The DB parameter group to associate with the instance.
   *
   * @default no parameter group
   */
  readonly parameterGroup?: IParameterGroup;

  /**
   * The CloudFormation policy to apply when the instance is removed from the
   * stack or replaced during an update.
   *
   * @default RemovalPolicy.Retain
   */
  readonly removalPolicy?: cdk.RemovalPolicy
}

/**
 * A new or imported database instance.
 */
export abstract class DatabaseInstanceBase extends cdk.Resource implements IDatabaseInstance {
  /**
   * Import an existing database instance.
   */
  public static fromDatabaseInstanceAttributes(scope: Construct, id: string, attrs: DatabaseInstanceAttributes): IDatabaseInstance {
    class Import extends DatabaseInstanceBase implements IDatabaseInstance {
      public readonly defaultPort = ec2.Port.tcp(attrs.port);
      public readonly instanceIdentifier = attrs.instanceIdentifier;
      public readonly dbInstanceEndpointAddress = attrs.instanceEndpointAddress;
      public readonly dbInstanceEndpointPort = attrs.port.toString();
      public readonly instanceEndpoint = new Endpoint(attrs.instanceEndpointAddress, attrs.port);
    }
    return new Import(scope, id);
  }

  /**
   * @inheritdoc
   */
  public abstract readonly dbInstanceEndpointAddress: string;

  /**
   * @inheritdoc
   */
  public abstract readonly dbInstanceEndpointPort: string;

  /**
   * @inheritdoc
   */
  public abstract readonly instanceEndpoint: Endpoint;

  /**
   * @inheritdoc
   */
  public abstract readonly instanceIdentifier: string;

  /**
   * @inheritdoc
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/Neptune',
      dimensionsMap: {
        DBInstanceIdentifier: this.instanceIdentifier,
      },
      metricName,
      ...props,
    });
  }
}

/**
 * A database instance
 *
 * @resource AWS::Neptune::DBInstance
 */
export class DatabaseInstance extends DatabaseInstanceBase implements IDatabaseInstance {

  /**
   * The instance's database cluster
   */
  public readonly cluster: IDatabaseCluster;

  /**
   * @inheritdoc
   */
  public readonly instanceIdentifier: string;

  /**
   * @inheritdoc
   */
  public readonly instanceEndpoint: Endpoint;

  /**
   * @inheritdoc
   */
  public readonly dbInstanceEndpointAddress: string;

  /**
   * @inheritdoc
   */
  public readonly dbInstanceEndpointPort: string;

  constructor(scope: Construct, id: string, props: DatabaseInstanceProps) {
    super(scope, id);

    const instance = new CfnDBInstance(this, 'Resource', {
      dbClusterIdentifier: props.cluster.clusterIdentifier,
      dbInstanceClass: props.instanceType._instanceType,
      availabilityZone: props.availabilityZone,
      dbInstanceIdentifier: props.dbInstanceName,
      dbParameterGroupName: props.parameterGroup?.parameterGroupName,
    });

    this.cluster = props.cluster;
    this.instanceIdentifier = instance.ref;
    this.dbInstanceEndpointAddress = instance.attrEndpoint;
    this.dbInstanceEndpointPort = instance.attrPort;

    // create a number token that represents the port of the instance
    const portAttribute = cdk.Token.asNumber(instance.attrPort);
    this.instanceEndpoint = new Endpoint(instance.attrEndpoint, portAttribute);

    instance.applyRemovalPolicy(props.removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });
  }
}
