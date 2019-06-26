let sftpClient = require("ssh2-sftp-client")
const patternMatcher = require('./utils/PatternMatcher');
//let configFile = require("./config/sftpcredentials.json");
let AWS = require("aws-sdk");
let sftp = new sftpClient();

class SFTPUpload{
    uploadfilesToSftp(config){
        sftp.connect(config.sftpServer).then(()=>{
        sftp.list(config.sftpDir).then(()=>{
            let s3 = new AWS.S3(config.aws)
            let bucketName = {Bucket:config.aws.bucket}
            s3.headBucket(bucketName).promise().then(()=>{
            s3.listObjectsV2(bucketName).promise()
            .then(s3BucketObjectList=>{
                //console.log(s3BucketObjectList.Contents)
                s3BucketObjectList.Contents.forEach(fileObj => {
                    //console.log(element.Key)
                    if (patternMatcher.matchPattern(config.filePattern, fileObj.Key)){
                        console.log(fileObj.Key)
                        let fileKey = fileObj.Key;
                        let fileParams = {Bucket:config.aws.bucket, Key:fileKey}
                        s3.getObject(fileParams).promise()
                        .then(fileContents=>{
                            let fileContent = fileContents.Body;
                            sftp.put(fileContent, config.sftpDir+fileKey);
                            console.log("File Uploaded");
                            return true
                        })
                        .catch(err=>{
                            console.log(err, "Error while uploading the file")
                            return false
                        })
                    }
                    else{
                        console.log("File name doesn't match with the file mask : ", fileObj.Key);
                        return false
                    }
                });   
                sftp.end();   
            })
    
            })
            .catch(err=>{
                console.log("Bucket does not exist with name",bucketName.Bucket);
                return false
            })
            }).catch(err=>{
                console.log(`SFTP Directory does not exist with given name `)
            })    
        }).catch((err) => {
            console.log(`${config.sftpServer.host}: There was some error. Unable to authenticate`);
            conn.end();
            callback('Error');
        });
    }
}

module.exports = new SFTPUpload();


