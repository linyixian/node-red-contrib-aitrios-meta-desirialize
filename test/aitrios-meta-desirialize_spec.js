const helper = require('node-red-node-test-helper');
const chai = require('chai');
const expect = chai.expect;
const flatbuffers = require('flatbuffers');
const AitriosSchemaClasses = require('../aitrios-meta-desirialize.js').AitriosSchemaClasses;
const should = require('should');

helper.init(require.resolve('node-red'));

describe('Aitrios Meta Deserialize Node', function() {
  this.timeout(5000);

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function(done) {
    const flow = [{ id: 'n1', type: 'aitrios-meta-desirialize', name: 'test name' }];
    helper.load(require('../aitrios-meta-desirialize.js'), flow, function() {
      const n1 = helper.getNode('n1');
      expect(n1).to.have.property('name', 'test name');
      done();
    });
  });

  it('should handle invalid input (non-buffer)', function(done) {
    const flow = [{ id: 'n1', type: 'aitrios-meta-desirialize', name: 'test name', wires: [['n2']] },
      { id: 'n2', type: 'helper' }];
    helper.load(require('../aitrios-meta-desirialize.js'), flow, function() {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      n2.on('input', function(msg) {
        expect(msg).to.have.property('error');
        expect(msg.error).to.equal('Input payload is not a Buffer.');
        done();
      });
      n1.receive({ payload: 'not a buffer' });
    });
  });

  it('should handle empty buffer', function(done) {
    const flow = [{ id: 'n1', type: 'aitrios-meta-desirialize', name: 'test name', wires: [['n2']] },
      { id: 'n2', type: 'helper' }];
    helper.load(require('../aitrios-meta-desirialize.js'), flow, function() {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      // eslint-disable-next-line no-unused-vars
      n2.on('input', function(msg) {
        expect(msg).to.have.property('error');
        done();
      });
      n1.receive({ payload: Buffer.from([]) });
    });
  });

  it('should deserialize valid metadata', function(done) {
    const buf = Buffer.from([
      12,0,0,0,0,0,6,0,10,0,4,0,6,0,0,0,12,0,0,0,0,0,6,0,8,0,4,0,6,0,0,0,4,0,0,0,1,0,0,0,16,0,0,0,12,0,16,0,0,0,7,0,8,0,12,0,12,0,0,0,0,0,0,1,20,0,0,0,0,0,127,63,12,0,20,0,4,0,8,0,12,0,16,0,12,0,0,0,59,0,0,0,46,0,0,0,56,1,0,0,56,1,0,0
    ]);
    const flow = [{ id: 'n1', type: 'aitrios-meta-desirialize', name: 'test name', wires: [['n2']] },
      { id: 'n2', type: 'helper' }];
    helper.load(require('../aitrios-meta-desirialize.js'), flow, function() {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      n2.on('input', function(msg) {
        expect(msg).to.have.property('payload');
        expect(msg.payload).to.have.property('perception');
        expect(msg.payload.perception).to.have.property('object_detection_list');
        expect(msg.payload.perception.object_detection_list).to.be.an('array');
        done();
      });
      n1.receive({ payload: buf });
    });
  });

  it('should deserialize metadata correctly', function (done) {
    const flow = [{ id: 'n1', type: 'aitrios-meta-deserialize', name: 'test name', wires: [['n2']] },
      { id: 'n2', type: 'helper' }];
    helper.load(require('../aitrios-meta-desirialize.js'), flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');

      // Create test metadata
      const builder = new flatbuffers.Builder(0);
      const deviceId = builder.createString('test-device');
      const inferenceId = builder.createString('test-inference');
      const label = builder.createString('test-label');

      // Create bbox
      AitriosSchemaClasses.BBox.startBBox(builder);
      AitriosSchemaClasses.BBox.addX(builder, 10);
      AitriosSchemaClasses.BBox.addY(builder, 20);
      AitriosSchemaClasses.BBox.addWidth(builder, 30);
      AitriosSchemaClasses.BBox.addHeight(builder, 40);
      const bbox = AitriosSchemaClasses.BBox.endBBox(builder);

      // Create inference data
      AitriosSchemaClasses.InferenceData.startInferenceData(builder);
      AitriosSchemaClasses.InferenceData.addLabel(builder, label);
      AitriosSchemaClasses.InferenceData.addScore(builder, 0.95);
      AitriosSchemaClasses.InferenceData.addBbox(builder, bbox);
      const inferenceData = AitriosSchemaClasses.InferenceData.endInferenceData(builder);

      // Create inference result
      const inferenceType = builder.createString('test-type');
      AitriosSchemaClasses.InferenceResult.startInferenceDataVector(builder, 1);
      builder.putOffset(inferenceData);
      const inferenceDataVec = builder.endVector();
      AitriosSchemaClasses.InferenceResult.startInferenceResult(builder);
      AitriosSchemaClasses.InferenceResult.addInferenceType(builder, inferenceType);
      AitriosSchemaClasses.InferenceResult.addInferenceData(builder, inferenceDataVec);
      const inferenceResult = AitriosSchemaClasses.InferenceResult.endInferenceResult(builder);

      // Create metadata
      AitriosSchemaClasses.Metadata.startInferenceResultVector(builder, 1);
      builder.putOffset(inferenceResult);
      const inferenceResultVec = builder.endVector();
      AitriosSchemaClasses.Metadata.startMetadata(builder);
      AitriosSchemaClasses.Metadata.addTimestamp(builder, 1234567890);
      AitriosSchemaClasses.Metadata.addDeviceId(builder, deviceId);
      AitriosSchemaClasses.Metadata.addInferenceId(builder, inferenceId);
      AitriosSchemaClasses.Metadata.addInferenceResult(builder, inferenceResultVec);
      const metadata = AitriosSchemaClasses.Metadata.endMetadata(builder);

      builder.finish(metadata);
      const buf = builder.asUint8Array();

      n2.on('input', function (msg) {
        msg.should.have.property('payload');
        msg.payload.should.have.property('timestamp', 1234567890);
        msg.payload.should.have.property('deviceId', 'test-device');
        msg.payload.should.have.property('inferenceId', 'test-inference');
        msg.payload.should.have.property('inferenceResult');
        msg.payload.inferenceResult.should.have.length(1);
        msg.payload.inferenceResult[0].should.have.property('inferenceType', 'test-type');
        msg.payload.inferenceResult[0].should.have.property('inferenceData');
        msg.payload.inferenceResult[0].inferenceData.should.have.length(1);
        msg.payload.inferenceResult[0].inferenceData[0].should.have.property('label', 'test-label');
        msg.payload.inferenceResult[0].inferenceData[0].should.have.property('score', 0.95);
        msg.payload.inferenceResult[0].inferenceData[0].should.have.property('bbox');
        msg.payload.inferenceResult[0].inferenceData[0].bbox.should.have.property('x', 10);
        msg.payload.inferenceResult[0].inferenceData[0].bbox.should.have.property('y', 20);
        msg.payload.inferenceResult[0].inferenceData[0].bbox.should.have.property('width', 30);
        msg.payload.inferenceResult[0].inferenceData[0].bbox.should.have.property('height', 40);
        done();
      });

      n1.receive({ payload: Buffer.from(buf) });
    });
  });

  it('should handle invalid input', function (done) {
    const flow = [{ id: 'n1', type: 'aitrios-meta-deserialize', name: 'test name', wires: [['n2']] },
      { id: 'n2', type: 'helper' }];
    helper.load(require('../aitrios-meta-desirialize.js'), flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');

      n2.on('input', function (msg) {
        should.fail('Should not receive message for invalid input');
      });

      n1.on('error', function (err) {
        err.should.have.property('message', 'Input must be a Buffer containing FlatBuffers data');
        done();
      });

      n1.receive({ payload: 'invalid' });
    });
  });
}); 