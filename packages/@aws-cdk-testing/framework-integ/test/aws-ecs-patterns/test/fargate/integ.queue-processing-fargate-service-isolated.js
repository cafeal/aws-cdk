"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-ecs-patterns-queue-isolated');
const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
    subnetConfiguration: [
        {
            cidrMask: 24,
            name: 'Public',
            subnetType: ec2.SubnetType.PUBLIC,
        },
        {
            cidrMask: 24,
            name: 'Isolated',
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
    ],
});
vpc.addS3Endpoint('S3Endpoint', [{ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }]);
const securityGroup = new ec2.SecurityGroup(stack, 'MyCustomSG', {
    vpc,
});
const queueProcessing = new aws_ecs_patterns_1.QueueProcessingFargateService(stack, 'IsolatedQueueService', {
    vpc,
    memoryLimitMiB: 512,
    image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
    securityGroups: [securityGroup],
    taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
});
queueProcessing.service.node.addDependency(vpc.addInterfaceEndpoint('SqsEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.SQS,
}), vpc.addInterfaceEndpoint('EcrEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.ECR,
}), vpc.addInterfaceEndpoint('EcrImageEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
}), vpc.addInterfaceEndpoint('CloudWatchLogsEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
}));
new integ.IntegTest(app, 'isolatedQueueProcessingFargateServiceTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucXVldWUtcHJvY2Vzc2luZy1mYXJnYXRlLXNlcnZpY2UtaXNvbGF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5xdWV1ZS1wcm9jZXNzaW5nLWZhcmdhdGUtc2VydmljZS1pc29sYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLDZDQUF5QztBQUN6QyxvREFBb0Q7QUFDcEQsbUVBQTZFO0FBRTdFLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztBQUNoRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNwQyxNQUFNLEVBQUUsQ0FBQztJQUNULG1CQUFtQixFQUFFO1FBQ25CO1lBQ0UsUUFBUSxFQUFFLEVBQUU7WUFDWixJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07U0FDbEM7UUFDRDtZQUNFLFFBQVEsRUFBRSxFQUFFO1lBQ1osSUFBSSxFQUFFLFVBQVU7WUFDaEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO1NBQzVDO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFHSCxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFbkYsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDL0QsR0FBRztDQUNKLENBQUMsQ0FBQztBQUVILE1BQU0sZUFBZSxHQUFHLElBQUksZ0RBQTZCLENBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFFO0lBQ3ZGLEdBQUc7SUFDSCxjQUFjLEVBQUUsR0FBRztJQUNuQixLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNuRSxjQUFjLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDL0IsV0FBVyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7Q0FDN0QsQ0FBQyxDQUFDO0FBRUgsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUN4QyxHQUFHLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFO0lBQ3RDLE9BQU8sRUFBRSxHQUFHLENBQUMsOEJBQThCLENBQUMsR0FBRztDQUNoRCxDQUFDLEVBQ0YsR0FBRyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRTtJQUN0QyxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLEdBQUc7Q0FDaEQsQ0FBQyxFQUNGLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRTtJQUMzQyxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLFVBQVU7Q0FDdkQsQ0FBQyxFQUNGLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyx3QkFBd0IsRUFBRTtJQUNqRCxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLGVBQWU7Q0FDNUQsQ0FBQyxDQUNILENBQUM7QUFFRixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLDJDQUEyQyxFQUFFO0lBQ3BFLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IFF1ZXVlUHJvY2Vzc2luZ0ZhcmdhdGVTZXJ2aWNlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcy1wYXR0ZXJucyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1lY3MtcGF0dGVybnMtcXVldWUtaXNvbGF0ZWQnKTtcbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge1xuICBtYXhBenM6IDIsXG4gIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICB7XG4gICAgICBjaWRyTWFzazogMjQsXG4gICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgIG5hbWU6ICdJc29sYXRlZCcsXG4gICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgIH0sXG4gIF0sXG59KTtcblxuXG52cGMuYWRkUzNFbmRwb2ludCgnUzNFbmRwb2ludCcsIFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQgfV0pO1xuXG5jb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnTXlDdXN0b21TRycsIHtcbiAgdnBjLFxufSk7XG5cbmNvbnN0IHF1ZXVlUHJvY2Vzc2luZyA9IG5ldyBRdWV1ZVByb2Nlc3NpbmdGYXJnYXRlU2VydmljZShzdGFjaywgJ0lzb2xhdGVkUXVldWVTZXJ2aWNlJywge1xuICB2cGMsXG4gIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gIGltYWdlOiBuZXcgZWNzLkFzc2V0SW1hZ2UocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3Nxcy1yZWFkZXInKSksXG4gIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gIHRhc2tTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQgfSxcbn0pO1xuXG5xdWV1ZVByb2Nlc3Npbmcuc2VydmljZS5ub2RlLmFkZERlcGVuZGVuY3koXG4gIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnU3FzRW5kcG9pbnQnLCB7XG4gICAgc2VydmljZTogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5TUVMsXG4gIH0pLFxuICB2cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ0VjckVuZHBvaW50Jywge1xuICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuRUNSLFxuICB9KSxcbiAgdnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdFY3JJbWFnZUVuZHBvaW50Jywge1xuICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuRUNSX0RPQ0tFUixcbiAgfSksXG4gIHZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnQ2xvdWRXYXRjaExvZ3NFbmRwb2ludCcsIHtcbiAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkNMT1VEV0FUQ0hfTE9HUyxcbiAgfSksXG4pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2lzb2xhdGVkUXVldWVQcm9jZXNzaW5nRmFyZ2F0ZVNlcnZpY2VUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=