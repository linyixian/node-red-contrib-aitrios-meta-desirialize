# node-red-contrib-aitrios-meta-desirialize

[English](#english) | [日本語](#japanese)

## English

A Node-RED node for deserializing AITRIOS metadata from FlatBuffers format to JSON.

### Features

- Deserializes AITRIOS metadata (FlatBuffers) to JSON format
- Supports object detection data including:
  - Class ID
  - Confidence score
  - Bounding box coordinates (2D)
- Handles error cases gracefully
- Provides detailed error messages

### Installation

```bash
npm install @linyixian/node-red-contrib-aitrios-meta-desirialize
```

### Usage

1. Add the "AITRIOS Meta Deserialize" node to your flow
2. Connect a node that outputs AITRIOS metadata in FlatBuffers format to the input
3. Connect the output to your desired destination node

#### Input

The input message should have a `payload` property containing the FlatBuffers data as a Buffer.

Example input:
```javascript
{
    payload: <Buffer containing FlatBuffers data>
}
```

#### Output

The output message will have a `payload` property containing the deserialized JSON data.

Example output:
```javascript
{
    payload: {
        perception: {
            object_detection_list: [
                {
                    class_id: 1,
                    score: 0.95,
                    bounding_box: {
                        left: 10,
                        top: 20,
                        right: 30,
                        bottom: 40
                    }
                }
            ]
        }
    }
}
```

#### Error Handling

If the input is invalid, the node will:
1. Set an error message in `msg.error`
2. Log the error using Node-RED's error logging
3. Forward the message with the error information

### Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Run all checks (lint, format, test)
npm run prepare
```

### Testing

The project includes unit tests for the following scenarios:
- Node loading
- Invalid input handling
- Empty buffer handling
- Valid metadata deserialization

To run the tests:
```bash
npm test
```

## 日本語

AITRIOSメタデータをFlatBuffers形式からJSON形式にデシリアライズするためのNode-REDノードです。

### 機能

- AITRIOSメタデータ（FlatBuffers）をJSON形式にデシリアライズ
- 以下のオブジェクト検出データをサポート：
  - クラスID
  - 信頼度スコア
  - バウンディングボックス座標（2D）
- エラーケースを適切に処理
- 詳細なエラーメッセージを提供

### インストール

```bash
npm install @linyixian/node-red-contrib-aitrios-meta-desirialize
```

### 使用方法

1. フローに「AITRIOS Meta Deserialize」ノードを追加
2. FlatBuffers形式のAITRIOSメタデータを出力するノードを入力に接続
3. 出力を目的のノードに接続

#### 入力

入力メッセージは、FlatBuffersデータをBufferとして含む`payload`プロパティを持つ必要があります。

入力例：
```javascript
{
    payload: <FlatBuffersデータを含むBuffer>
}
```

#### 出力

出力メッセージは、デシリアライズされたJSONデータを含む`payload`プロパティを持ちます。

出力例：
```javascript
{
    payload: {
        perception: {
            object_detection_list: [
                {
                    class_id: 1,
                    score: 0.95,
                    bounding_box: {
                        left: 10,
                        top: 20,
                        right: 30,
                        bottom: 40
                    }
                }
            ]
        }
    }
}
```

#### エラー処理

入力が無効な場合、ノードは以下の処理を行います：
1. `msg.error`にエラーメッセージを設定
2. Node-REDのエラーログ機能を使用してエラーを記録
3. エラー情報を含むメッセージを転送

### 開発

```bash
# 依存関係のインストール
npm install

# テストの実行
npm test

# コードのリント
npm run lint

# コードのフォーマット
npm run format

# すべてのチェックを実行（リント、フォーマット、テスト）
npm run prepare
```

### テスト

プロジェクトには以下のシナリオのユニットテストが含まれています：
- ノードのロード
- 無効な入力の処理
- 空バッファの処理
- 有効なメタデータのデシリアライズ

テストを実行するには：
```bash
npm test
```

## License

Apache License 2.0
