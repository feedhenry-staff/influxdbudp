var proxyquire = require("proxyquire");
var assert = require("assert");
var sinon = require("sinon");

function getFunc(dummy) {

  return proxyquire("../lib", {
    dgram: {
      createSocket: function(type) {
        return dummy
      }
    }
  });
}
describe("Influxdb udp connector", function() {
  it("should send udp packet following line protocol", function() {
    var mock = {
      send: sinon.spy(),
      close: sinon.spy()
    }
    var func = getFunc(mock);
    func({
      host:"127.0.50.11",
      port:3556,
      tags:"cpu",
      values:"value=50"
    });
    sinon.assert.calledOnce(mock.send);
    var buf=new Buffer("cpu value=50");
    sinon.assert.calledWith(mock.send,buf,0,buf.length,3556,"127.0.50.11");
    sinon.assert.calledOnce(mock.close);
  });

  it ("should specifically say not closing it",function(){
    var mock = {
      send: sinon.spy(),
      close: sinon.spy()
    }
    var func = getFunc(mock);
    func({
      host:"127.0.50.11",
      port:3556,
      tags:"cpu,project=pro1",
      values:"value=50",
      timestamp:"123456789s",
      close:false
    });
    sinon.assert.calledOnce(mock.send);
    var buf=new Buffer("cpu,project=pro1 value=50 123456789s");
    sinon.assert.calledWith(mock.send,buf,0,buf.length,3556,"127.0.50.11");
    sinon.assert.notCalled(mock.close);
  });
});
