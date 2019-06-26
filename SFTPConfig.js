let configFile = require("./config/sftpcredentials.json");
const sftpUpload = require("./SFTPUpload")
const config = {
    sftpServer : {host: configFile.sftpServer.host,
    username: configFile.sftpServer.username, 
    password: configFile.sftpServer.password,
    port: configFile.sftpServer.port},
    sftpDir : configFile.sftpServer.sftpDir,
    aws: {
        bucket: configFile.s3bucket, accessKeyId: process.env.aws_access_key_id, secretAccessKey: process.env.aws_secret_access_key, sessionToken: process.env.aws_session_token, region: 'us-east-1'
      },
    filePattern:configFile.filePattern   
}

sftpUpload.uploadfilesToSftp(config);

