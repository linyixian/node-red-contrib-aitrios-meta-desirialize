const assert = require('assert');
const RED = { nodes: { registerType: function() {} } };
const mod = require('../aitrios-meta-desirialize.js');
mod(RED);
const classes = mod.AitriosSchemaClasses;
const data = [12,0,0,0,0,0,6,0,10,0,4,0,6,0,0,0,12,0,0,0,0,0,6,0,8,0,4,0,6,0,0,0,4,0,0,0,1,0,0,0,16,0,0,0,12,0,16,0,0,0,7,0,8,0,12,0,12,0,0,0,0,0,0,1,20,0,0,0,0,0,127,63,12,0,20,0,4,0,8,0,12,0,16,0,12,0,0,0,59,0,0,0,46,0,0,0,56,1,0,0,56,1,0,0];
const buf = Buffer.from(data);
const bb = new (require('flatbuffers').ByteBuffer)(buf);
const top = classes.ObjectDetectionTop.getRootAsObjectDetectionTop(bb);
const perception = top.perception(new classes.ObjectDetectionData());
const result = { perception: { object_detection_list: [] } };
for (let i = 0; i < perception.objectDetectionListLength(); i++) {
  const obj = perception.objectDetectionList(i, new classes.GeneralObject());
  const item = { class_id: obj.classId(), score: obj.score() };
  if (obj.boundingBoxType() === classes.BoundingBox.BoundingBox2d) {
    const bb2d = obj.boundingBox(new classes.BoundingBox2d());
    item.bounding_box = {
      left: bb2d.left(),
      top: bb2d.top(),
      right: bb2d.right(),
      bottom: bb2d.bottom()
    };
  }
  result.perception.object_detection_list.push(item);
}
const expected = {
  perception: {
    object_detection_list: [
      {
        class_id: 0,
        score: 0.99609375,
        bounding_box: {
          left: 59,
          top: 46,
          right: 312,
          bottom: 312
        }
      }
    ]
  }
};
assert.deepStrictEqual(result, expected);
console.log('Test passed');

