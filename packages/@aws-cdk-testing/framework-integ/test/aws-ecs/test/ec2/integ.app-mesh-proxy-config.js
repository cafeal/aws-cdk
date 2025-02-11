"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const ecs = require("aws-cdk-lib/aws-ecs");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-appmesh-proxy');
// Create a cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
});
const prox = ecs.ProxyConfigurations.appMeshProxyConfiguration({
    containerName: 'envoy',
    properties: {
        ignoredUID: 1337,
        proxyIngressPort: 15000,
        proxyEgressPort: 15001,
        appPorts: [9080, 9081],
        egressIgnoredIPs: ['169.254.170.2', '169.254.169.254'],
    },
});
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
    networkMode: ecs.NetworkMode.AWS_VPC,
    proxyConfiguration: prox,
    ipcMode: ecs.IpcMode.HOST,
    pidMode: ecs.PidMode.TASK,
});
taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 256,
});
taskDefinition.addContainer('envoy', {
    // envoyproxy/envoy:latest tag gone from docker hub: https://github.com/envoyproxy/envoy/issues/6344
    image: ecs.ContainerImage.fromRegistry('envoyproxy/envoy:v1.16.2'),
    memoryLimitMiB: 256,
});
new ecs.Ec2Service(stack, 'Service', {
    cluster,
    taskDefinition,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXBwLW1lc2gtcHJveHktY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXBwLW1lc2gtcHJveHktY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRWhFLG1CQUFtQjtBQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRXJELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM5RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO0lBQzdDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO0NBQy9DLENBQUMsQ0FBQztBQUVILE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyx5QkFBeUIsQ0FBQztJQUM3RCxhQUFhLEVBQUUsT0FBTztJQUN0QixVQUFVLEVBQUU7UUFDVixVQUFVLEVBQUUsSUFBSTtRQUNoQixnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7UUFDdEIsZ0JBQWdCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUM7S0FDdkQ7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ2pFLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU87SUFDcEMsa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJO0lBQ3pCLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUk7Q0FDMUIsQ0FBQyxDQUFDO0FBRUgsY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7SUFDakMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO0lBQ2xFLGNBQWMsRUFBRSxHQUFHO0NBQ3BCLENBQUMsQ0FBQztBQUVILGNBQWMsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO0lBQ25DLG9HQUFvRztJQUNwRyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7SUFDbEUsY0FBYyxFQUFFLEdBQUc7Q0FDcEIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7SUFDbkMsT0FBTztJQUNQLGNBQWM7Q0FDZixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1lY3MtaW50ZWctYXBwbWVzaC1wcm94eScpO1xuXG4vLyBDcmVhdGUgYSBjbHVzdGVyXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG59KTtcblxuY29uc3QgcHJveCA9IGVjcy5Qcm94eUNvbmZpZ3VyYXRpb25zLmFwcE1lc2hQcm94eUNvbmZpZ3VyYXRpb24oe1xuICBjb250YWluZXJOYW1lOiAnZW52b3knLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgaWdub3JlZFVJRDogMTMzNyxcbiAgICBwcm94eUluZ3Jlc3NQb3J0OiAxNTAwMCxcbiAgICBwcm94eUVncmVzc1BvcnQ6IDE1MDAxLFxuICAgIGFwcFBvcnRzOiBbOTA4MCwgOTA4MV0sXG4gICAgZWdyZXNzSWdub3JlZElQczogWycxNjkuMjU0LjE3MC4yJywgJzE2OS4yNTQuMTY5LjI1NCddLFxuICB9LFxufSk7XG5jb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkFXU19WUEMsXG4gIHByb3h5Q29uZmlndXJhdGlvbjogcHJveCxcbiAgaXBjTW9kZTogZWNzLklwY01vZGUuSE9TVCxcbiAgcGlkTW9kZTogZWNzLlBpZE1vZGUuVEFTSyxcbn0pO1xuXG50YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICBtZW1vcnlMaW1pdE1pQjogMjU2LFxufSk7XG5cbnRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignZW52b3knLCB7XG4gIC8vIGVudm95cHJveHkvZW52b3k6bGF0ZXN0IHRhZyBnb25lIGZyb20gZG9ja2VyIGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2Vudm95cHJveHkvZW52b3kvaXNzdWVzLzYzNDRcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2Vudm95cHJveHkvZW52b3k6djEuMTYuMicpLFxuICBtZW1vcnlMaW1pdE1pQjogMjU2LFxufSk7XG5cbm5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIHRhc2tEZWZpbml0aW9uLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19