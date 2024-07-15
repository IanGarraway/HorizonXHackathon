import Spinner from 'react-bootstrap/Spinner';

function Loading() {
  return (<>
    <Spinner animation="border" role="status">     
    </Spinner>
    Loading...
  </>
  )
}

export default Loading