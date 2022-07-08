import './App.css';
import { useEffect } from 'react';
import { useState } from 'react';
import CustomerPanel from './CustomerPanel';


class Token {
  setToken(newToken) {
    this.token = newToken
  }

  getToken() {
    return this.token
  }
}

function App() {
  const [dataState, setDataState] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(undefined)

  const modalAppearFunc = (data) => {
    setShowModal(true)
    setModalData(data)
  }

  var authToken = new Token()
  
  useEffect(() => {
    fetch('https://mitramas-test.herokuapp.com/auth/login', { // login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": "akun12@mig.id", "password" : "BA8A9E03" })
    })
    .then(response => response.json())
    .then(data => {
      authToken.setToken(data.access_token) // end of login process
    }).then(() => {
      fetch('https://mitramas-test.herokuapp.com/customers', { // get all data
        method: 'GET',
        headers: new Headers({
          'Authorization' : authToken.getToken()
        })
      })
        .then( response => {
            if (response.ok) {
              return response.json()
            } else {
              throw response
            }
          }
        )
        .then(data => {
          setDataState({ customers: data })
        })
        .catch(err => {
          console.log(err)
        }) // end of get all data process
      }, [])
    }
  )

  console.log(dataState !== undefined ? dataState.customers.data : "nothing yet")
  
  return (
    <div className="App">
      {showModal ? 
      <div className="modal">
        <h2>
          Edit Customer
        </h2>
        <h5>
          Name: {modalData.name}
        </h5>
        <h5>
          Address: {modalData.address}
        </h5>
        <h5>
          Country: {modalData.country}
        </h5>
        <h5>
          Status: {modalData.status ? "Active" : "Not Active"}
        </h5>
        <h5>
          Job: {modalData.job_title}
        </h5>
        <button onClick={()=>setShowModal(false)}>
          Save
        </button>
        <button onClick={()=>setShowModal(false)}>
          Close
        </button>
      </div> : <></>}
      <div className="customer-container">
        {dataState !== undefined ? 
        dataState.customers.data.map(obj => 
        <CustomerPanel
          custId={obj.id}
          name={obj.name}
          address={obj.address}
          country={obj.country}
          status={obj.status}
          job_title={obj.job_title}
          created_at={obj.created_at}
          updated_at={obj.updated_at}
          buttonFunc={() => modalAppearFunc({
            id: obj.id,
            name: obj.name,
            address: obj.address,
            country: obj.country,
            status: obj.status,
            job_title: obj.job_title
          })}
        />
        ) 
        : 
        "Loading..."
        }
      </div>
    </div>
  );
}

export default App;
