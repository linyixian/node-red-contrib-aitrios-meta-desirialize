const flatbuffers = require('flatbuffers');
const AitriosSchemaClasses = require('./aitrios_schema_generated');

function AitriosMetaDeserialize(RED) {
  function AitriosMetaDeserializeNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      try {
        if (!msg.payload || !Buffer.isBuffer(msg.payload)) {
          node.error('Input must be a Buffer containing FlatBuffers data');
          node.send({ error: 'Input payload is not a Buffer.' });
          return;
        }

        if (msg.payload.length === 0) {
          node.send({ error: 'Buffer is empty.' });
          return;
        }

        const buf = new flatbuffers.ByteBuffer(msg.payload);
        const metadata = AitriosSchemaClasses.Metadata.getRootAsMetadata(buf);

        const result = {
          timestamp: metadata.timestamp(),
          deviceId: metadata.deviceId(),
          inferenceId: metadata.inferenceId(),
          inferenceResult: []
        };

        for (let i = 0; i < metadata.inferenceResultLength(); i++) {
          const inference = metadata.inferenceResult(i);
          const inferenceData = {
            inferenceType: inference.inferenceType(),
            inferenceData: []
          };

          for (let j = 0; j < inference.inferenceDataLength(); j++) {
            const data = inference.inferenceData(j);
            const inferenceDataItem = {
              label: data.label(),
              score: data.score(),
              bbox: data.bbox() ? {
                x: data.bbox().x(),
                y: data.bbox().y(),
                width: data.bbox().width(),
                height: data.bbox().height()
              } : null
            };
            inferenceData.inferenceData.push(inferenceDataItem);
          }

          result.inferenceResult.push(inferenceData);
        }

        msg.payload = result;
        node.send(msg);
      } catch (error) {
        node.error('Error deserializing metadata: ' + error.message);
        node.send({ error: 'Error deserializing metadata: ' + error.message });
      }
    });
  }

  RED.nodes.registerType('aitrios-meta-desirialize', AitriosMetaDeserializeNode);
}

module.exports = AitriosMetaDeserialize;
module.exports.AitriosSchemaClasses = AitriosSchemaClasses;
