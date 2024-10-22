document.addEventListener('DOMContentLoaded', function() {
  // Fetch cart data from the API
  const apiURL = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';
  let itemToRemoveIndex = null;
  let cartItemsData = [];
  const loader = document.getElementById('loader');

  // Show the loader
  loader.style.display = 'block';
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      loader.style.display = 'none';
      cartItemsData = data.items;
      renderCartItems(data.items);
      updateTotals(data.original_total_price);
    });

  // Render the cart items dynamically
  function renderCartItems(items) {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    items.forEach((item,index) => {
      const itemRow = document.createElement('div');
      itemRow.classList.add('cart-item');
      
      itemRow.innerHTML = `
      <ul class="cart-ulItem">
              <li style="width:150px;" class="item-image"><img  src="${item.featured_image.url}" alt="${item.title}"> <span class="item-color">${item.title}</span></li>
              <li><p class="item-color">Rs. ${formatCurrency(item.price / 100)}</p></li>
              <li><input type="number" value="${item.quantity}" min="1" class="item-quantity"></li>
              <li><p class="item-subtotal">Rs. ${formatCurrency(item.line_price / 100)}</p></li>
              <li><button class="remove-item">🗑️</button></li>
          </ul>
      `;
      
      // Event listeners for quantity change and item removal
      itemRow.querySelector('.item-quantity').addEventListener('input', function() {
        updateItemSubtotal(itemRow, item.price);
      });

      itemRow.querySelector('.remove-item').addEventListener('click', function() {
          itemToRemoveIndex = index;
          openModal();
       
      });

      cartItemsContainer.appendChild(itemRow);
    });
  }
  
   // Function to open the modal
   function openModal(index) {
      
      const modal = document.getElementById('removeModal');
      modal.style.display = 'flex';  // Show the modal
  }

  function closeModal() {
      const modal = document.getElementById('removeModal');
      modal.style.display = 'none';  // Hide the modal
  }
  
  // Function to confirm the removal of an item
  function confirmRemove() {
     
      if (itemToRemoveIndex !== null) {
          cartItemsData.splice(itemToRemoveIndex, 1);  // Remove the item from the data array
          renderCartItems(cartItemsData);  // Re-render the cart items after removal
          updateTotalsAfterRemoval();  // Update totals
          itemToRemoveIndex = null;  // Reset the index
          closeModal();  // Close the modal
      }
      }
  // Helper function to format currency
  function formatCurrency(amount) {
      if (isNaN(amount)) amount = 0;  // Handle NaN or undefined values
      return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  }
  // Update the subtotal and total values
  function updateItemSubtotal(row, price) {
      const quantity = parseInt(row.querySelector('.item-quantity').value, 10); // Convert to number
      if (isNaN(quantity) || quantity < 1) {
          alert('Quantity must be a valid number greater than 0');
          return;  // Exit if quantity is invalid
      }
      const subtotal = price * quantity / 100;
    row.querySelector('.item-subtotal').textContent = `Rs. ${formatCurrency(subtotal)}`;
    // Update total after changing quantity
    updateTotals(subtotal);
  }

  // Update cart totals
  function updateTotals(subtotal) {
    document.getElementById('subtotal').textContent = `Rs. ${formatCurrency(subtotal)}`;
    document.getElementById('total').textContent = `Rs. ${formatCurrency(subtotal)}`;
  }

  // Update totals after removing an item
  function updateTotalsAfterRemoval(amountToDeduct) {
      const newSubtotal = cartItemsData.reduce((total, item) => total + (item.price * item.quantity / 100), 0);
    updateTotals(newSubtotal);
  }
  function checkOut(){
      alert("Your order is Confirmed, Thank You");
  }
   // Modal buttons event listeners
   document.getElementById('confirmRemoveBtn').addEventListener('click', confirmRemove);  // Confirm button
   document.getElementById('cancelRemoveBtn').addEventListener('click', closeModal);   // Cancel button
   document.getElementById('checkout').addEventListener('click', checkOut);  
});