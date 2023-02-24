import React from 'react';
import { FacebookProvider, Comments } from 'react-facebook';

const CommentBox = ({href}) => {
  return (
    <FacebookProvider appId="6036191729778590">
      <Comments width={"100%"} href={href} />
    </FacebookProvider>
  );
};

export default CommentBox;