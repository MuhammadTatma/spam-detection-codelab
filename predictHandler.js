const tf = require('@tensorflow/tfjs')
const DICTIONARY = require('./dictionary');

/** 
 * Function that takes an array of words, converts words to tokens,
 * and then returns a Tensor representation of the tokenization that
 * can be used as input to the machine learning model.
 */
function tokenize(wordArray) {
  // Always start with the START token.
  let returnArray = [DICTIONARY.START];
  
  // Loop through the words in the sentence you want to encode.
  // If word is found in dictionary, add that number else
  // you add the UNKNOWN token.
  for (var i = 0; i < wordArray.length; i++) {
    let encoding = DICTIONARY.LOOKUP[wordArray[i]];
    returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding);
  }
  
  // Finally if the number of words was < the minimum encoding length
  // minus 1 (due to the start token), fill the rest with PAD tokens.
  while (i < ENCODING_LENGTH - 1) {
    returnArray.push(DICTIONARY.PAD);
    i++;
  }
  
  // Log the result to see what you made.
  // console.log([returnArray]);
  
  // Convert to a TensorFlow Tensor and return that.
  return tf.tensor([returnArray]);
}




// The number of input elements the ML Model is expecting.
const ENCODING_LENGTH = 20;

// Set the URL below to the path of the model.json file you uploaded.
const MODEL_JSON_URL = 'http://0.0.0.0:8080/spam-detection-model/model.json';
// Set the minimum confidence for spam comments to be flagged.
// Remember this is a number from 0 to 1, representing a percentage
// So here 0.75 == 75% sure it is spam.
const SPAM_THRESHOLD = 0.75;

// Create a variable to store the loaded model once it is ready so 
// you can use it elsewhere in the program later.
let model = undefined;


const predictHandler = async (req, res) => {
  const {comment} = req.body;
  let lowercaseSentenceArray = comment.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ');
  // const result = await loadAndPredict(tokenize(lowercaseSentenceArray));
  if(lowercaseSentenceArray.length > ENCODING_LENGTH){
    return res.status(400).send({
      "message" : `maximum word is ${ENCODING_LENGTH}`
    })
  }

  const inputTensor = tokenize(lowercaseSentenceArray);

  // Load the model.json and binary files you hosted. Note this is 
  // an asynchronous operation so you use the await keyword
  if (model === undefined) {
    model = await tf.loadLayersModel(MODEL_JSON_URL);
  }

  // Once model has loaded you can call model.predict and pass to it
  // an input in the form of a Tensor. You can then store the result.
  let results = await model.predict(inputTensor);

  // Print the result to the console for us to inspect.
  // results.print();
  
  // TODO: Add extra logic here later to do something useful
  results.data().then((dataArray)=>{
    if (dataArray[1] > SPAM_THRESHOLD) {
      return res.send({
        isSpam : true,
        detail : {
          spam_treshold : SPAM_THRESHOLD,
          spam : dataArray[1],
          not_spam : dataArray[0]
        },
        
      })
    }
    return res.send({
      isSpam : false,
        detail : {
          spam_treshold : SPAM_THRESHOLD,
          spam : dataArray[1],
          not_spam : dataArray[0]
        },
    })
  })
}

module.exports = predictHandler;