let trans = [];
let chart;

fetch("/api/transaction")
  .then(response => {
    return response.json();
  })
  .then(data => {
    
    trans = data;

    populateTotal();
    populateTable();
    populateChart();
  });

function populateTotal() {

  let total = trans.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  trans.forEach(trans => {
    
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${trans.name}</td>
      <td>${trans.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

function populateChart() {
 
  let reversed = trans.slice().reverse();
  let sum = 0;

  
  let labels = reversed.map(t => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  
  let data = reversed.map(t => {
    sum += parseInt(t.value);
    return sum;
  });

  
  if (chart) {
    chart.destroy();
  }

  let ctx = document.getElementById("chart").getContext("2d");

  chart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
}

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  let trans = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  
  if (!isAdding) {
    trans.value *= -1;
  }

  
  trans.unshift(trans);

 
  populateChart();
  populateTable();
  populateTotal();
  
  
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(trans),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    
    saveRecord(trans);

   
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};