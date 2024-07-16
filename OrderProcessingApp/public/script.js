document.getElementById('orderForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const customer_name = document.getElementById('customer_name').value;
    const product = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;
    const order_date = document.getElementById('order_date').value;
    const status = document.getElementById('status').value;
  
    const order = {
      customer_name: customer_name,
      product: product,
      quantity: quantity,
      order_date: order_date,
      status: status
    };
  
    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders: [order] })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
      console.log('Success:', data);
      fetchOrders();
    })
    .catch(error => {
      console.error('Error adding order:', error);
      alert('Error adding order: ' + error.message); // Display error to the user
    });
  });
  
  function fetchOrders() {
    fetch('http://localhost:3000/orders')
      .then(response => response.json())
      .then(orders => {
        const ordersTableBody = document.getElementById('ordersTableBody');
        ordersTableBody.innerHTML = ''; // Clear existing rows
        orders.forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.customer_name}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>${order.order_date}</td>
            <td>${order.status}</td>
          `;
          ordersTableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching orders:', error));
  }
  
  document.addEventListener('DOMContentLoaded', fetchOrders);
  