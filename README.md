#Influxdb UDP Connector
This lib follows line protocol.

#Usage
```
npm install influxdbudp
```

```js
var send=require("influxdbudp");
var udpSocket=send({
  host:host,
  port:4444,
  tags:"cpu,unit=unit1",
  values:"value=60,severity=\"low\""
});
```
#Params
```
{
  tags:String // e.g. "cpu" / "cpu,project=myProject,unit=unit1"
  values: String // e.g. 'value=100,isServer=fales,note="server not available"'
  timestamp: String // optional epoch nanoseconds / microseconds / miliseconds .e.g. "123456789s"
  host: String // ipaddress or hostname where Influxdb is
  port: Number // udp port of influxdb,
  cached: boolean // optional cache the socket. default false;
  close: boolean // close the socket after sending the message. default true;
}
```
