import React, { useEffect } from 'react';
import AppSettings from '../data/AppSettings';
import AsideTs from '../components/AsideTs';
import Post from '../components/hocExamples/Post';
import Comment from '../components/hocExamples/Comment';
import withCounter from '../components/hocExamples/WithCounter';

// type / interface usage (pretty much the same)
type FunctionComponentTsProps = {

}
/*interface TsTestProps {
  ...
}*/

const FunctionComponentTs: React.FC<FunctionComponentTsProps> = () => {
  useEffect(() => { // effect 1
    console.log("useEffect() 1 set");
    document.title = "Functional Component (with TS) | " + AppSettings.seoTitle; // put pre-title
    return () => {
      console.log("useEffect() 1 unset");
      document.title = AppSettings.seoTitle; // clear pre-title
    }
  });

  // creating HOC dynamically (by wrapping one with another)
  const PostWithCounter: React.FC = withCounter(Post)
  const PostWithCounter3: React.FC = withCounter(Post, 3)
  const CommentWithCounter: React.FC = withCounter(Comment)
  const CommentWithCounter8: React.FC = withCounter(Comment, 8)

  return (
    <>
      <AsideTs title="My Title" paragraph="This is my paragraph." color="red" isFirst={true} />
      <br />
      <h2>HOC Examples Below (State & Events Used in HOC)</h2>
      <PostWithCounter />
      <CommentWithCounter />
      <PostWithCounter3 />
      <CommentWithCounter8 />
    </>
  )
}

export default FunctionComponentTs