# spam-detection-codelab
Deploy a model from the [Spam Detection tutorial](https://developers.google.com/learn/pathways/get-started-text-classification-web) you can download the 
model from [TensorFlow Hub](https://tfhub.dev/tensorflow/tfjs-model/tutorials/spam-detection/tfjs/1). build with ExpressJs, TensorflowJs, and deployed on Cloud Run



Base url : https://spamdetection-aphk7v4ylq-et.a.run.app/

### Detect Spam Comment

- Path : `/detect`
- Method : `POST`
- Request Body:
    <br>maximum word : 20 
    ```json
      {
          "Comment": "this is very very unuseful comment, you must consider it as spam",
      }
    ```

- Response :

   ```json
      {
        "isSpam": true,
        "detail": {
          "spam_treshold": 0.75,
          "spam": 0.9968324303627014,
          "not_spam": 0.0031675926875323057
        }
      }
    ```
    
