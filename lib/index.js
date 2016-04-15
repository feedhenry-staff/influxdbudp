/**
params:
{
  tags:String // e.g. "cpu" / "cpu,project=myProject,unit=unit1"
  values: String // e.g. 'value=100,isServer=fales,note="server not available"'
  timestamp: String // optional epoch nanoseconds / microseconds / miliseconds .e.g. "123456789s"
  host: String // ipaddress or hostname where Influxdb is
  port: Number // udp port of influxdb,
  cached: boolean // optional cache the socket. default false;
  close: boolean // close the socket after sending the message. default true;
}

*/
var dgram=require("dgram");
var cached={};
module.exports=function(params){
  var host=params.host;
  var port=params.port;
  if (host && port){
    var socket=null;
    if (cached[host] && cached[host][port]){
        socket=cached[host][port];
    }else{
      socket=dgram.createSocket("udp4");
      if (params.cached && params.cached===true){
        if (!cached[host]){
          cached[host]={};
        }
        cached[host][port]=socket
      }
    }
    if (params.tags && params.values){
      var message=params.tags+" "+params.values;
      if (params.timestamp){
        message+=" "+params.timestamp;
      }
      message+="\n";
      var buf=new Buffer(message);
      socket.send(buf, 0, buf.length, port, host, function () {
        socket.close();
      });

      return socket;
    }else{
      console.error("Influxdb Line protocol requires measurements and values");
    }
  }else{
    console.error("Influxdb host or port not specified. Get:",host,port);
  }
}
