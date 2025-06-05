module.exports = function(RED) {
    "use strict";
    const flatbuffers = require("flatbuffers");

    // Provided FlatBuffers code wrapped in an IIFE to manage scope
    const AitriosSchemaClasses = ((fb) => {
        const localNs = {}; // Namespace for the schema classes and functions

        // --- Content from bounding-box2d.ts ---
        var BoundingBox2d = /** @class */ (function () {
            function BoundingBox2d_() {
                this.bb = null;
                this.bb_pos = 0;
            }
            BoundingBox2d_.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            BoundingBox2d_.getRootAsBoundingBox2d = function (bb, obj) {
                return (obj || new BoundingBox2d_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            BoundingBox2d_.getSizePrefixedRootAsBoundingBox2d = function (bb, obj) {
                bb.setPosition(bb.position() + fb.SIZE_PREFIX_LENGTH);
                return (obj || new BoundingBox2d_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            BoundingBox2d_.prototype.left = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            BoundingBox2d_.prototype.top = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            BoundingBox2d_.prototype.right = function () {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            BoundingBox2d_.prototype.bottom = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
            };
            BoundingBox2d_.startBoundingBox2d = function (builder) { builder.startObject(4); };
            BoundingBox2d_.addLeft = function (builder, left) { builder.addFieldInt32(0, left, 0); };
            BoundingBox2d_.addTop = function (builder, top) { builder.addFieldInt32(1, top, 0); };
            BoundingBox2d_.addRight = function (builder, right) { builder.addFieldInt32(2, right, 0); };
            BoundingBox2d_.addBottom = function (builder, bottom) { builder.addFieldInt32(3, bottom, 0); };
            BoundingBox2d_.endBoundingBox2d = function (builder) { var offset = builder.endObject(); return offset; };
            BoundingBox2d_.createBoundingBox2d = function (builder, left, top, right, bottom) {
                BoundingBox2d_.startBoundingBox2d(builder);
                BoundingBox2d_.addLeft(builder, left);
                BoundingBox2d_.addTop(builder, top);
                BoundingBox2d_.addRight(builder, right);
                BoundingBox2d_.addBottom(builder, bottom);
                return BoundingBox2d_.endBoundingBox2d(builder);
            };
            return BoundingBox2d_;
        }());
        localNs.BoundingBox2d = BoundingBox2d;

        // --- Content from bounding-box.ts ---
        var BoundingBox;
        (function (BoundingBox) {
            BoundingBox[BoundingBox["NONE"] = 0] = "NONE";
            BoundingBox[BoundingBox["BoundingBox2d"] = 1] = "BoundingBox2d";
        })(BoundingBox || (BoundingBox = {}));
        localNs.BoundingBox = BoundingBox;

        localNs.unionToBoundingBox = function(type, accessor) {
            switch (BoundingBox[type]) {
                case 'NONE': return null;
                case 'BoundingBox2d': return accessor(new localNs.BoundingBox2d());
                default: return null;
            }
        }

        localNs.unionListToBoundingBox = function(type, accessor, index) {
            switch (BoundingBox[type]) {
                case 'NONE': return null;
                case 'BoundingBox2d': return accessor(index, new localNs.BoundingBox2d());
                default: return null;
            }
        }

        // --- Content from general-object.ts ---
        var GeneralObject = /** @class */ (function () {
            function GeneralObject_() {
                this.bb = null;
                this.bb_pos = 0;
            }
            GeneralObject_.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            GeneralObject_.getRootAsGeneralObject = function (bb, obj) {
                return (obj || new GeneralObject_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            GeneralObject_.getSizePrefixedRootAsGeneralObject = function (bb, obj) {
                bb.setPosition(bb.position() + fb.SIZE_PREFIX_LENGTH);
                return (obj || new GeneralObject_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            GeneralObject_.prototype.classId = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
            };
            GeneralObject_.prototype.boundingBoxType = function () {
                var offset = this.bb.__offset(this.bb_pos, 6);
                return offset ? this.bb.readUint8(this.bb_pos + offset) : localNs.BoundingBox.NONE;
            };
            GeneralObject_.prototype.boundingBox = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 8);
                return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
            };
            GeneralObject_.prototype.score = function () {
                var offset = this.bb.__offset(this.bb_pos, 10);
                return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
            };
            GeneralObject_.startGeneralObject = function (builder) { builder.startObject(4); };
            GeneralObject_.addClassId = function (builder, classId) { builder.addFieldInt32(0, classId, 0); };
            GeneralObject_.addBoundingBoxType = function (builder, boundingBoxType) { builder.addFieldInt8(1, boundingBoxType, localNs.BoundingBox.NONE); };
            GeneralObject_.addBoundingBox = function (builder, boundingBoxOffset) { builder.addFieldOffset(2, boundingBoxOffset, 0); };
            GeneralObject_.addScore = function (builder, score) { builder.addFieldFloat32(3, score, 0.0); };
            GeneralObject_.endGeneralObject = function (builder) { var offset = builder.endObject(); return offset; };
            GeneralObject_.createGeneralObject = function (builder, classId, boundingBoxType, boundingBoxOffset, score) {
                GeneralObject_.startGeneralObject(builder);
                GeneralObject_.addClassId(builder, classId);
                GeneralObject_.addBoundingBoxType(builder, boundingBoxType);
                GeneralObject_.addBoundingBox(builder, boundingBoxOffset);
                GeneralObject_.addScore(builder, score);
                return GeneralObject_.endGeneralObject(builder);
            };
            return GeneralObject_;
        }());
        localNs.GeneralObject = GeneralObject;

        // --- Content from object-detection-data.ts ---
        var ObjectDetectionData = /** @class */ (function () {
            function ObjectDetectionData_() {
                this.bb = null;
                this.bb_pos = 0;
            }
            ObjectDetectionData_.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ObjectDetectionData_.getRootAsObjectDetectionData = function (bb, obj) {
                return (obj || new ObjectDetectionData_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ObjectDetectionData_.getSizePrefixedRootAsObjectDetectionData = function (bb, obj) {
                bb.setPosition(bb.position() + fb.SIZE_PREFIX_LENGTH);
                return (obj || new ObjectDetectionData_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ObjectDetectionData_.prototype.objectDetectionList = function (index, obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new localNs.GeneralObject()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
            };
            ObjectDetectionData_.prototype.objectDetectionListLength = function () {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
            };
            ObjectDetectionData_.startObjectDetectionData = function (builder) { builder.startObject(1); };
            ObjectDetectionData_.addObjectDetectionList = function (builder, objectDetectionListOffset) { builder.addFieldOffset(0, objectDetectionListOffset, 0); };
            ObjectDetectionData_.createObjectDetectionListVector = function (builder, data) {
                builder.startVector(4, data.length, 4);
                for (var i = data.length - 1; i >= 0; i--) { builder.addOffset(data[i]); }
                return builder.endVector();
            };
            ObjectDetectionData_.startObjectDetectionListVector = function (builder, numElems) { builder.startVector(4, numElems, 4); };
            ObjectDetectionData_.endObjectDetectionData = function (builder) { var offset = builder.endObject(); return offset; };
            ObjectDetectionData_.createObjectDetectionData = function (builder, objectDetectionListOffset) {
                ObjectDetectionData_.startObjectDetectionData(builder);
                ObjectDetectionData_.addObjectDetectionList(builder, objectDetectionListOffset);
                return ObjectDetectionData_.endObjectDetectionData(builder);
            };
            return ObjectDetectionData_;
        }());
        localNs.ObjectDetectionData = ObjectDetectionData;

        // --- Content from object-detection-top.ts ---
        var ObjectDetectionTop = /** @class */ (function () {
            function ObjectDetectionTop_() {
                this.bb = null;
                this.bb_pos = 0;
            }
            ObjectDetectionTop_.prototype.__init = function (i, bb) {
                this.bb_pos = i;
                this.bb = bb;
                return this;
            };
            ObjectDetectionTop_.getRootAsObjectDetectionTop = function (bb, obj) {
                return (obj || new ObjectDetectionTop_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ObjectDetectionTop_.getSizePrefixedRootAsObjectDetectionTop = function (bb, obj) {
                bb.setPosition(bb.position() + fb.SIZE_PREFIX_LENGTH);
                return (obj || new ObjectDetectionTop_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
            };
            ObjectDetectionTop_.prototype.perception = function (obj) {
                var offset = this.bb.__offset(this.bb_pos, 4);
                return offset ? (obj || new localNs.ObjectDetectionData()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
            };
            ObjectDetectionTop_.startObjectDetectionTop = function (builder) { builder.startObject(1); };
            ObjectDetectionTop_.addPerception = function (builder, perceptionOffset) { builder.addFieldOffset(0, perceptionOffset, 0); };
            ObjectDetectionTop_.endObjectDetectionTop = function (builder) { var offset = builder.endObject(); return offset; };
            ObjectDetectionTop_.finishObjectDetectionTopBuffer = function (builder, offset) { builder.finish(offset); };
            ObjectDetectionTop_.finishSizePrefixedObjectDetectionTopBuffer = function (builder, offset) { builder.finish(offset, undefined, true); };
            ObjectDetectionTop_.createObjectDetectionTop = function (builder, perceptionOffset) {
                ObjectDetectionTop_.startObjectDetectionTop(builder);
                ObjectDetectionTop_.addPerception(builder, perceptionOffset);
                return ObjectDetectionTop_.endObjectDetectionTop(builder);
            };
            return ObjectDetectionTop_;
        }());
        localNs.ObjectDetectionTop = ObjectDetectionTop;

        return localNs;
    })(flatbuffers); // Pass the flatbuffers module to the IIFE

    // Expose AitriosSchemaClasses for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.AitriosSchemaClasses = AitriosSchemaClasses;
    }

    function AitriosMetaDeserializeNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.AitriosSchemaClasses = AitriosSchemaClasses;  // Make AitriosSchemaClasses available on the node instance

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node,arguments) }; // For backwards compatibility with older Node-RED versions
            done = done || function(err) { if (err) node.error(err, msg); }; // For backwards compatibility

            if (!Buffer.isBuffer(msg.payload)) {
                const error = new Error("Input payload is not a Buffer.");
                msg.error = error.message;
                node.error(error.message, msg);
                send(msg);
                done(error);
                return;
            }

            try {
                const buf = new flatbuffers.ByteBuffer(msg.payload);
                const top = AitriosSchemaClasses.ObjectDetectionTop.getRootAsObjectDetectionTop(buf);
                const jsonData = {};

                const perceptionData = top.perception(new AitriosSchemaClasses.ObjectDetectionData());
                if (perceptionData) {
                    jsonData.perception = { object_detection_list: [] };
                    const listLength = perceptionData.objectDetectionListLength();

                    for (let i = 0; i < listLength; i++) {
                        // Create a new GeneralObject instance for each item to deserialize properly
                        const generalObj = perceptionData.objectDetectionList(i, new AitriosSchemaClasses.GeneralObject());
                        if (generalObj) {
                            const objData = {
                                class_id: generalObj.classId(),
                                score: generalObj.score()
                            };

                            const bbType = generalObj.boundingBoxType();
                            if (bbType === AitriosSchemaClasses.BoundingBox.BoundingBox2d) {
                                const boundingBox = generalObj.boundingBox(new AitriosSchemaClasses.BoundingBox2d());
                                if (boundingBox) {
                                    objData.bounding_box = {
                                        left: boundingBox.left(),
                                        top: boundingBox.top(),
                                        right: boundingBox.right(),
                                        bottom: boundingBox.bottom()
                                    };
                                } else {
                                    objData.bounding_box = null;
                                }
                            } else {
                                objData.bounding_box = null;
                                if (bbType !== AitriosSchemaClasses.BoundingBox.NONE) {
                                    node.warn(`Unknown bounding box type: ${bbType} for object at index ${i}`, msg);
                                }
                            }
                            jsonData.perception.object_detection_list.push(objData);
                        }
                    }
                }

                msg.payload = jsonData;
                send(msg);
                done();

            } catch (err) {
                const error = new Error("Failed to deserialize FlatBuffers: " + err.toString());
                msg.error = error.message;
                node.error(error.message, msg);
                send(msg);
                done(error);
            }
        });
    }

    RED.nodes.registerType("aitrios-meta-desirialize", AitriosMetaDeserializeNode);
};