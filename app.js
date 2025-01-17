const roomsSection = document.getElementById("rooms-container");
const seeHotels = document.getElementById("seeHotels");
const header = document.querySelector('header');


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
window.addEventListener('scroll', () => {
    if (window.scrollY >= 70) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

window.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 1s ease";

    setTimeout(() => {
        document.body.style.opacity = "1";

        const parentOfFiveStars = document.querySelector(".parentOfFiveStars");

        setTimeout(() => {
            parentOfFiveStars.classList.add("visible");
        }, 1500); 
    }, 1000); 
});

document.addEventListener("DOMContentLoaded", () => {
    const goTopDiv = document.querySelector(".goTopDiv");

    goTopDiv.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY >= 300) {
            goTopDiv.classList.add("visible"); 
        } else {
            goTopDiv.classList.remove("visible"); 
        }
    });
});