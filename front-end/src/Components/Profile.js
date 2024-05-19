import React,{useState,useEffect} from 'react'
import {useCookies} from 'react-cookie';

import NavbarDetail from './NavbarDetail.js'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Form from 'react-bootstrap/Form';

function Profile() {
    const [user,setUser]=useState([])
    const [token]=useCookies(["access_token"])

    //property create start 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //end
    const [show1, setShow1] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => {fetchProperties();
        setShow1(true)};

        const [properties, setProperties] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        image: null,
      });

      const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
          setFormData({ ...formData, [name]: files[0] });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            data.append(key, value);
        }
        console.log("data property:",data)
        fetch('http://127.0.0.1:8000/property/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token['access_token']}`
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            handleClose();  // Close the modal on successful submission
            // Optionally, refresh the list of properties or reset formData here
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    useEffect(()=>{
        fetch('http://127.0.0.1:8000/profile/',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token['access_token']}`
          }
        })
        .then(resp =>resp.json())
        .then(resp => setUser(resp))
        .catch(error => console.log(error))
    
        
    },[])

    console.log("user:",user)

    const fetchProperties = () => {
        fetch('http://127.0.0.1:8000/property/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token['access_token']}`
            }
        })
        .then(resp => resp.json())
        .then(resp => setProperties(resp))
        .catch(error => console.log(error));
    };



    return (
        <div>
            <NavbarDetail/>

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {properties.length > 0 ? (
                        <ul>
                            {properties.map(property => (
                                <li key={property.id}>
                                    <img src={"http://localhost:8000"+property.image} alt={property.title} style={{ width: '100%', height: 'auto' }} />
                                    <h5>{property.title}</h5>
                                    <p>{property.description}</p>
                                    <p>Price: ${property.price}</p>
                                    <p>Address: {property.address}, {property.city}, {property.state}, {property.zip_code}</p>
                                    <p>Bedrooms: {property.bedrooms}</p>
                                    <p>Bathrooms: {property.bathrooms}</p>
                                    <p>Square Feet: {property.square_feet}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No properties listed yet.</p>
                    )}
                </Modal.Body>
                
            </Modal>

           

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                <Modal.Title>Sell Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {/* onSubmit={handleSubmit} */}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formState">
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formZipCode">
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formBedrooms">
                        <Form.Label>Bedrooms</Form.Label>
                        <Form.Control type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formBathrooms">
                        <Form.Label>Bathrooms</Form.Label>
                        <Form.Control type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formSquareFeet">
                        <Form.Label>Square Feet</Form.Label>
                        <Form.Control type="number" name="square_feet" value={formData.square_feet} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" name="image" onChange={handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                            List
                    </Button>
                    
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            <div className="Profile">
                <div className="profileTop my-4">
                <h1><b>USER PROFILE</b></h1>
                </div>
                <div className="profileMiddl my-4">
                    {/* <h6><b>Username:</b>{user.profile_name}</h6> */}
                    <h2 className="prof my-2"><b>First Name:</b>{user.first_name}</h2>
                    <h2 className="prof my-2"><b>Last Name:</b>{user.last_name}</h2>
                    <h2 className="prof my-2"><b>Phone Number:</b>{user.phone_number}</h2>
                    {/* <h2 className="prof my-2"><b>Profile:</b> {user.is_seller ? 'Seller' : 'Buyer'}</h2> */}
                </div>

                <div className="profileBottom my-2">
                <div>
                <Button variant="primary" onClick={handleShow}>
                    Sell Property
                </Button>
                </div>
                <div>
                <Button className="btn my-2" variant="primary" onClick={handleShow1}>
                    Listed Properties
                </Button>
                </div>

                </div>



            </div>
        </div>
    )
}

export default Profile
