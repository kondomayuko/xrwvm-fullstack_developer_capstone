import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;

  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");

    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" ");

    let jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();

    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET",
    });

    const retobj = await res.json();

    if (retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) {
        setDealer(dealerobjs[0]);
      }
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, {
      method: "GET",
    });

    const retobj = await res.json();
    let carmodelsarr = Array.from(retobj.CarModels);
    setCarmodels(carmodelsarr);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Post a Review</h1>

          <h2 style={styles.dealerName}>
            {dealer.full_name || "Loading dealership..."}
          </h2>

          <p style={styles.subtitle}>
            Share your experience and help other customers choose the right dealership.
          </p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Review</label>
            <textarea
              id="review"
              rows="7"
              placeholder="Write your review here..."
              style={styles.textarea}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Purchase Date</label>
            <input
              type="date"
              style={styles.input}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Car Make and Model</label>
            <select
              name="cars"
              id="cars"
              style={styles.input}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="" disabled>
                Choose Car Make and Model
              </option>

              {carmodels.map((carmodel, index) => (
                <option
                  key={index}
                  value={carmodel.CarMake + " " + carmodel.CarModel}
                >
                  {carmodel.CarMake} {carmodel.CarModel}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Car Year</label>
            <input
              type="number"
              placeholder="Example: 2022"
              min="2015"
              max="2023"
              style={styles.input}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "90vh",
    backgroundColor: "#f4f8fb",
    padding: "50px 20px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "70%",
    maxWidth: "850px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  title: {
    color: "#003366",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  dealerName: {
    color: "darkturquoise",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "30px",
  },
  formGroup: {
    marginBottom: "22px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#333",
  },
  textarea: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    marginTop: "15px",
    backgroundColor: "darkturquoise",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default PostReview;