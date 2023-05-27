const POST_COMMENT_BTN = document.getElementById('post');
const COMMENT_TEXT = document.getElementById('comment');
const COMMENTS_LIST = document.getElementById('commentsList');
// CSS styling class to indicate comment is being processed when
// posting to provide visual feedback to users.
const PROCESSING_CLASS = 'processing';

// Store username of logged in user. Right now you have no auth
// so default to Anonymous until known.
var currentUserName = 'Anonymous';

/** 
 * Function to handle the processing of submitted comments.
 **/
function handleCommentPost() {
  // Only continue if you are not already processing the comment.
  if (! POST_COMMENT_BTN.classList.contains(PROCESSING_CLASS)) {
    POST_COMMENT_BTN.classList.add(PROCESSING_CLASS);
    COMMENT_TEXT.classList.add(PROCESSING_CLASS);
    let currentComment = COMMENT_TEXT.innerText;
    console.log(currentComment);

     // Create a list item DOM element in memory.
     let li = document.createElement('li');
    
    axios({
      method: 'post',
      url: '/detect',
      data: {
        comment: currentComment ,
        
      }
    }).then( (res) => {
      POST_COMMENT_BTN.classList.remove(PROCESSING_CLASS);
      COMMENT_TEXT.classList.remove(PROCESSING_CLASS);

      let p = document.createElement('p');
      p.innerText = COMMENT_TEXT.innerText;

      let spanName = document.createElement('span');
      spanName.setAttribute('class', 'username');
      spanName.innerText = currentUserName;

      let spanDate = document.createElement('span');
      spanDate.setAttribute('class', 'timestamp');
      let curDate = new Date();
      spanDate.innerText = curDate.toLocaleString();

      li.appendChild(spanName);
      li.appendChild(spanDate);
      li.appendChild(p);
      COMMENTS_LIST.prepend(li);

      // Reset comment text.
      COMMENT_TEXT.innerText = '';

      const isSpam = res.data.isSpam
      console.log( "ispam : " +  isSpam);
      console.log(res);
      if(isSpam)li.classList.add('spam');
    })
  }
}

POST_COMMENT_BTN.addEventListener('click', handleCommentPost);