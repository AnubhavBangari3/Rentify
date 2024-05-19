import React,{useState,useEffect} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import {useHistory} from 'react-router-dom';

function Register() {

    let history=useHistory();
    //Start
    const [username,setUsername]=useState('');

    const [firstName,setFirstName]=useState('');

    const [lastName,setLastName]=useState('');

    const [email,setEmail]=useState('');

    const [password,setPassword]=useState('');

    const [password2,setPassword2]=useState('');

    const [phone,setPhone]=useState('');

    const [seller,setSeller]=useState(false);

    const [buyer,setBuyer]=useState(false);

    const handleSellerChange = (e) => {
        setSeller(true);
        if (e.target.checked) {
            setBuyer(false);
        }
    };

    const handleBuyerChange = (e) => {
        setBuyer(true);
        if (e.target.checked) {
            setSeller(false);
        }
    };
    //End


    //Email Error start
    const [emailError, setEmailError] = useState('');
    const handleEmailBlur = () => {
        if (!isValidEmail(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const isValidEmail = (email) => {
        // Regular expression pattern for basic email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };
    //Email Error End

    //Register start
    const [show, setShow] = useState(false);
    const registerButton = async () =>{
        if (password !== password2){
            setShow(true);
            return;
        }
       

        const data={
            username:username,
            email:email,
            first_name: firstName,
            last_name: lastName,
            password:password,
            password2:password,
            phone_number:phone,
            is_seller:seller,
            is_buyer:buyer
        }
        console.log("Register data:",data)
        try{
            const response= await fetch('http://127.0.0.1:8000/register/',{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body:JSON.stringify(data),
            });
           

            if (response.ok){
                alert("registration Done")
                
                history.push('/')
                window.location.reload()
                
            }
            else{
                alert("Registration Failed")
            }
           

        }
        catch(error){
            alert(`Error:${error.message}`)
        }


    }



    //Register End


    return (
        <div className="Register">
            <div className='registerTop'>
            <h1><b>RENTIFY REGISTER</b></h1>
            </div>

            <div className='registerMiddle my-2'>

            <div>
                <input type="text" className="form-control" name="username" id="username" value={username}
                onChange={e => setUsername(e.target.value)} placeholder="Username"/>
            </div>
            <br/>
            <div>
                <input type="text" className="form-control" name="firstname" id="firstname" value={firstName}
            onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
            </div>
            <br/>
            <div>
                <input type="text" className="form-control" name="lastname" id="lastname" value={lastName}
            onChange={e => setLastName(e.target.value)} placeholder="Last Name"/>
            </div>
            <br/>
            <div>
                <input type="email" className="form-control" name="email" id="email" value={email}
            onChange={e=>setEmail(e.target.value)} placeholder="Email" onBlur={handleEmailBlur}/>
            {emailError && <div className="error-message">{emailError}<br/>
            Examples of correct email address - abcd@test.com
            </div>}
            </div>
            <br/>
            <div>
                <input type="password" className="form-control" name="password" id="password" value={password}
            onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
            </div>
            <br/>
            <div>
                <input type="password" className="form-control" name="confirmpassword" id="confirmpassword" value={password2}
            onChange={e=>setPassword2(e.target.value)} placeholder="Confirm Password"/>

                {show && (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Password and Confirm Password are not same.</Alert.Heading>
                <p>
                Confirm Password should be same as Password.
                </p>
            </Alert>)}
            </div>
            <br/>
            <div>
                <input type="tel" className="form-control" name="phone" id="phone" value={phone}
            onChange={e=>setPhone(e.target.value)} placeholder="Phone Number"/>
            </div>
            <br/>
            <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="role" id="seller" value={seller}
                    disabled={buyer}
                    onChange={handleSellerChange}/>
                    <label className="form-check-label" htmlFor="seller">
                        <b>Seller</b>
                    </label>
                </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" name="role" id="buyer" value={buyer}
                disabled={seller}
                onChange={handleBuyerChange}/>
                <label className="form-check-label" htmlFor="buyer">
                    <b>Buyer</b>
                </label>
            </div>
            
            </div>

            <div className="registerBottom my-2">
            <div>
            {(username && firstName && lastName && email && password && password2 )?
                <button className="btn btn-secondary my-2 w-100" variant="outline-secondary " onClick={()=>registerButton()}><b>Register</b></button> :  <button className="register-button btn btn-warning w-100">Please fill the details</button>}

            </div>

            <div className="or-divider my-2">
                    <span className="line"></span>
                    <span className="text">OR</span>
                    <span className="line"></span>
            </div>

            <div>
                <Button className="btn my-2 w-100" variant="outline-primary" onClick={() => 
                {history.push('/')
                window.location.reload()}}><b>Back</b></Button>{' '}
            </div>
                
            </div>

        </div>
    )
}

export default Register
