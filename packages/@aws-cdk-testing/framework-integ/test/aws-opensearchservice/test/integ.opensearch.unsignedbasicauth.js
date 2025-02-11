"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new opensearch.Domain(this, 'Domain', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
            useUnsignedBasicAuth: true,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-opensearch-unsignedbasicauth');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcub3BlbnNlYXJjaC51bnNpZ25lZGJhc2ljYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm9wZW5zZWFyY2gudW5zaWduZWRiYXNpY2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0U7QUFFcEUsZ0VBQWdFO0FBRWhFLE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDcEMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxPQUFPLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUI7WUFDbkQsb0JBQW9CLEVBQUUsSUFBSTtTQUMzQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsd0NBQXdDLENBQUMsQ0FBQztBQUM3RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBvcGVuc2VhcmNoIGZyb20gJ2F3cy1jZGstbGliL2F3cy1vcGVuc2VhcmNoc2VydmljZSc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgb3BlbnNlYXJjaC5Eb21haW4odGhpcywgJ0RvbWFpbicsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIHZlcnNpb246IG9wZW5zZWFyY2guRW5naW5lVmVyc2lvbi5FTEFTVElDU0VBUkNIXzdfMSxcbiAgICAgIHVzZVVuc2lnbmVkQmFzaWNBdXRoOiB0cnVlLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBUZXN0U3RhY2soYXBwLCAnY2RrLWludGVnLW9wZW5zZWFyY2gtdW5zaWduZWRiYXNpY2F1dGgnKTtcbmFwcC5zeW50aCgpO1xuIl19