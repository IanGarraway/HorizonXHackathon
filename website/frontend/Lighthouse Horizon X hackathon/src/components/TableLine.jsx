import React from 'react'
import { Card } from 'react-bootstrap/esm'

function TableLine({lineData}) {
    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Name: {lineData.name}</Card.Title>
                    <Card.Text>
                        Organisation: {lineData.organization} <br/>
                        Creation Date: {lineData.createdDate} <br />
                        Access: {lineData.access}
                    </Card.Text>
                </Card.Body>

            </Card>
          
        </div>
    )
}

export default TableLine