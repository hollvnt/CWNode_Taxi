window.addEventListener('DOMContentLoaded', (event) => {
    const orderConfirmation = document.getElementById('orderConfirmation');
    const confirmationText = document.getElementById('confirmationText'); 
    const orderStatus = localStorage.getItem('orderStatus');
    const orderStatusTimestamp = localStorage.getItem('orderStatusTimestamp');
    const currentTime = Math.floor(Date.now() / 1000); 
  
    if (orderStatus && orderStatusTimestamp) {
      const elapsedTime = currentTime - orderStatusTimestamp;
  
      if (elapsedTime < 60) { 
        orderConfirmation.style.opacity = 0;
        orderConfirmation.style.display = 'block'; 
        setTimeout(() => {
          orderConfirmation.style.opacity = 1;
        }, 100);
  
        confirmationText.textContent = orderStatus; 
        startTimer(60 - elapsedTime, document.querySelector('#timer'));
      } else { 
        localStorage.removeItem('orderStatus');
        localStorage.removeItem('orderStatusTimestamp');
      }
    }
  });
  
  document.getElementById('orderForm').onsubmit = function(e) {
    e.preventDefault(); 
    const orderConfirmation = document.getElementById('orderConfirmation');
    orderConfirmation.style.opacity = 0; 
    orderConfirmation.style.display = 'block'; 
    setTimeout(() => {
      orderConfirmation.style.opacity = 1;
    }, 100);
  
    confirmationText.textContent = 'Заказ оформлен';
    startTimer(60, document.querySelector('#timer')); 
    localStorage.setItem('orderStatus', 'Заказ оформлен');
    localStorage.setItem('orderStatusTimestamp', Math.floor(Date.now() / 1000)); 
  };
  
  function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
  
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
  
      display.textContent = minutes + ":" + seconds;
  
      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  }
  
  
  
  
          function generateTariffPrices() { 
            const tariffAPrice = Math.floor(Math.random() * (8 - 2.5 + 1) + 2.5); 
            const tariffBPrice = Math.floor(Math.random() * (15 - 6 + 1) + 6); 
            const tariffCPrice = Math.floor(Math.random() * (30 - 12 + 1) + 12); 
            
            document.getElementById('priceA').textContent = tariffAPrice; 
            document.getElementById('priceB').textContent = tariffBPrice; 
            document.getElementById('priceC').textContent = tariffCPrice; 
            
            const radioButtons = document.getElementsByName('OrderTariff'); 
            
            radioButtons.forEach(radioButton => { 
              radioButton.addEventListener('click', () => { 
                const selectedTariff = document.querySelector('input[name="OrderTariff"]:checked').value; 
                const selectedTariffPrice = selectedTariff === '1' ? tariffAPrice : selectedTariff === '2' ? tariffCPrice : tariffBPrice; 
                document.getElementById('OrderCost').value = selectedTariffPrice; 
                }); 
              }); 
            } 
            window.onload = generateTariffPrices; 
  
            const socket = io();
  
            socket.on('orderAccepted', (data) => {
    const orderID = data.orderID;
    const driverID = data.driverID;
    const confirmationText = document.getElementById('confirmationText');
  
    if (confirmationText) {
      confirmationText.textContent = `Водитель принял заказ ${orderID}`;
    }
  });
  
    