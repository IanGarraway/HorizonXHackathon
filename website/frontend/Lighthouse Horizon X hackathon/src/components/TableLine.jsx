import Card from './UI/Card';
function TableLine({lineData}) {
    return ( 
            <Card>
                Name: {lineData.name} <br />
                Organisation: {lineData.organization} <br/>
                Creation Date: {lineData.createdDate} <br />
                Access: {lineData.access}
            </Card>
    )
}

export default TableLine