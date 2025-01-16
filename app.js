const roomsSection = document.getElementById("rooms-container");
const seeHotels = document.getElementById("seeHotels");


fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll")
    .then(hotel => hotel.json())
    .then(hotel => {
        console.log(hotel);

        hotel.slice(0, 6).forEach(room => {
            const div = document.createElement('div');
            div.classList.add('room');
            div.innerHTML = `
       <div class="room">
    <div class="room-image">
        <img src="${room.images[0].source}" alt="Room">
    </div>
    <div class="room-info">
        <h3>${room.name}</h3>
        <p>€ ${room.pricePerNight} <span>a night</span></p>
    </div>
    <button onclick ="goToDetails(${room.id})" class="book-now">BOOK NOW</button>
</div>
        `;
            roomsSection.appendChild(div);
        });
    })
    .catch(err => {
        console.log(err);
    });

seeHotels.addEventListener('click', () => {
    window.location.href = './hotels.html';
});

const navItems = document.querySelectorAll("nav ul li");

navItems.forEach(item => {
    item.addEventListener("click", function () {
        navItems.forEach(navItem => navItem.classList.remove("active"));
        
        item.classList.add("active");
    });
});

document.querySelectorAll('.room').forEach(room => {
    room.addEventListener('mouseover', () => {
    });
    room.addEventListener('mouseleave', () => {
    });
});

function goToDetails(roomId) {
    sessionStorage.setItem("room", roomId);
    window.location.href = './details.html';
    console.log(roomId);
    
}