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
      send: sinon.stub(),
      close: sinon.spy()
    }
    var func = getFunc(mock);
    var cb=sinon.spy()
    func({
      host:"127.0.50.11",
      port:3556,
      tags:"cpu",
      values:"value=50"
    },cb);
    mock.send.yield([]);
    sinon.assert.calledOnce(mock.send);
    sinon.assert.calledOnce(cb);
    var buf=new Buffer("cpu value=50\n");
    sinon.assert.calledWith(mock.send,buf,0,buf.length,3556,"127.0.50.11");
    sinon.assert.calledOnce(mock.close);
  });
});
