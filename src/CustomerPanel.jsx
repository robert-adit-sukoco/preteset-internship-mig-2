
const CustomerPanel = (props) => {
    var authToken = ""

    function setToken(newToken) {
        authToken = newToken
    }

    async function deleteCustomer() {
        fetch('https://mitramas-test.herokuapp.com/auth/login', { // login
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": "akun12@mig.id", "password" : "BA8A9E03" })
        })
        .then(response => response.json())
        .then(data => { // end of login process
            setToken(data.access_token) 
        }).then(() => {
            fetch('https://mitramas-test.herokuapp.com/customers', { // delete process
                method: 'DELETE',
                headers: new Headers({
                    'Authorization' : authToken
                }),
                body: {
                    id: parseInt(props.custId)
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    console.log(`deleting id ${props.custId}`)
                    throw response
                }
            })
            .then(data => console.log(data)).catch(err => console.log(err)) // end of delete process
        })
    }

    return (
        <div className="customer-panel">
            <h3>
                {props.name}
            </h3>
            <div>
                Address: {props.address} <br/>
                Country: {props.country} <br/>
                Job: {props.job_title} <br/>
                Status: {props.status ? "Active" : "Not active"} <br/>
                Created: {props.created_at} <br/>
                Last edited: {props.updated_at} <br/>
            </div>
            <br></br>
            <button onClick={props.buttonFunc} className="edit-button">Edit</button>
            <button onClick={() => deleteCustomer()} className="delete-button">Delete</button>
        </div>
    )
}

export default CustomerPanel