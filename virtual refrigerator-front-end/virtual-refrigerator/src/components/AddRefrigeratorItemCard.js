
import { Card } from 'react-bootstrap';
import { MDBIcon } from 'mdbreact';

export default function AddRefrigeratorItemCard(props){
    return (
        <div    
            style={{cursor:"pointer"}}
            title={"add Refrigerator item"}>
                <Card className="refrigerator-item" style={{ width: '13vw', height: '15vw' }} onClick={(e) => { props.createRefrigeratorItemModal() }}>
                    <Card.Body>
                                <MDBIcon style={{marginLeft:"30%",marginTop:"-1%"}} icon="plus" size="3x" />
                                <Card.Text style={{fontSize : "1.5vw",marginTop:"40%",marginLeft:"15%"}}>
                                  add item
                                </Card.Text>
                    </Card.Body>
                </Card>
            </div>
    )
}