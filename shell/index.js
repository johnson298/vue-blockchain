const api = require('ipfs-api');
const ipfs = api({host: '18.138.102.196', port: '5002', protocol: 'http'});

const publish = (path, key) =>{
    ipfs.name.publish(`/ipfs/${path}`, {
        key
    }, (err, result) => {
        console.log(err, '----', result)
    })
}

const uploadFiles = (config) => {
    ipfs.util.addFromFs(config.filesPath, { recursive: true , ignore: ['subfolder/to/ignore/**']}, (err, result) => {
        if (err) { throw err }
        else{
            ipfs.pin.add(result[result.length-1].hash, function (errors, data) {
                if (errors || typeof data == "undefined") {
                    console.log(errors);
                } else {
                    publish(data[0].hash, config.key)
                }
            })
        }
    })
}
const config = {
    filesPath: `${process.cwd()}/ipfs_dist`,
    key: 'burger'
}
uploadFiles(config)

