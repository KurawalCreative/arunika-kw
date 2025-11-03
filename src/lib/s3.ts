import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    region: "global",
});

export default s3;
