import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function Loading() {
  return (
    <Spinner animation="border" role="status">
      Loading...
    </Spinner>
  )
}

export default Loading