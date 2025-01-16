let roomId = sessionStorage.getItem("room");
let form = document.querySelector('form');
let h3 = document.getElementById("RoomName");
console.log(roomId);

fetch(`https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${roomId}`)
    .then(res => res.json())
    .then(room => {
        console.log(room);
        h3.innerText = room.name;
        let span = document.createElement("span");
        let p = document.createElement("p");
        p.innerText = "a night";
        span.innerText = "€ " + room.pricePerNight + ", -";
        h3.appendChild(span);
        h3.appendChild(p);
        console.log(span);
        
        const details = document.getElementById('details');
        details.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-track">
                ${room.images
                    .map(
                        (image, index) =>
                            `<img class="carousel-image" src="${image.source}" alt="room image" style="left: ${index * 100}%;"/>`
                    )
                    .join('')}
            </div>
            <div class="carousel-buttons">
                <button id="prev-btn" class="carousel-btn"><i class="fas fa-angle-left"></i></button>
                <button id="next-btn" class="carousel-btn"> <i class="fas fa-angle-right"></i></button>
            </div>
            <div class="carousel-indicators">
                ${room.images
                    .map((_, index) => 
                        `<div class="carousel-circle" data-index="${index}"></div>`
                    )
                    .join('')}
            </div>
        </div>
        `;

        function autoScrolling() {
            const track = document.querySelector('.carousel-track');
            const circles = document.querySelectorAll('.carousel-circle');
            let currentIndex = 0;
        
            const updatePosition = () => {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateCircles();
            };
        
            const updateCircles = () => {
                circles.forEach((circle, index) => {
                    if (index === currentIndex) {
                        circle.style.backgroundColor = 'white';
                    } else {
                        circle.style.backgroundColor = 'transparent';
                    }
                });
            };
        
            const prevButton = document.getElementById('prev-btn');
            const nextButton = document.getElementById('next-btn');
        
            prevButton.addEventListener('click', () => {
                if (currentIndex === 0) {
                    currentIndex = circles.length - 1; 
                } else {
                    currentIndex--;
                }
                updatePosition();
            });
        
            nextButton.addEventListener('click', () => {
                if (currentIndex === circles.length - 1) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updatePosition();
            });
        
            setInterval(() => {
                if (currentIndex === circles.length - 1) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updatePosition();
            }, 3000);
        
            updatePosition();
        }
        
        autoScrolling();
        

        form.addEventListener('submit', (e) => {
            e.preventDefault();
        
            let formInfo = new FormData(form);
            let formData = Object.fromEntries(formInfo);
        
            formData.roomID = roomId; 
        
            fetch("https://hotelbooking.stepprojects.ge/api/Booking", {
                method: "POST",
                headers: {
                    accept: "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(answer => {
                console.log(answer);
                alert("თქვენი შეკვეთა წარმატებით დაიჯავშნა")
            })
            .catch(err => { 
                console.log(err);
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); 
        const month = String(today.getMonth() + 1).padStart(2, '0');  
        const year = today.getFullYear();
    

        const formattedDate = `${year}-${month}-${day}`;
    

        flatpickr("#checkIn", {
            dateFormat: "Y-m-d", 
            placeholder: "Check-In",
            minDate: formattedDate 
        });
    
        flatpickr("#checkOut", {
            dateFormat: "Y-m-d", 
            placeholder: "Check-Out",
            minDate: formattedDate 
        });
    });
    

const navLinks = document.querySelectorAll('.Overview ul li a');
const contentSections = document.querySelectorAll('.Overview div');

function showSection(targetId) {
    navLinks.forEach(nav => nav.classList.remove('active'));
    contentSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; 
    });

    const targetLink = document.querySelector(`a[href="#${targetId}"]`);
    targetLink.classList.add('active');

    const targetSection = document.getElementById(targetId);
    targetSection.classList.add('active');
    targetSection.style.display = 'block'; 
}

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);  
        showSection(targetId);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const defaultSection = 'Overview';  
    showSection(defaultSection);  
});

const roomsContainer = document.getElementById("rooms-container");

fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll")
    .then(hotel => hotel.json())
    .then(hotel => {
        console.log(hotel);

        const shuffledRooms = hotel.slice(); 
        for (let i = shuffledRooms.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledRooms[i], shuffledRooms[j]] = [shuffledRooms[j], shuffledRooms[i]];
        }

        const randomRooms = shuffledRooms.slice(0, 3);

        randomRooms.forEach(room => {
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
                    <button onclick="goToDetails(${room.id})" class="book-now">BOOK NOW</button>
                </div>
            `;
            roomsContainer.appendChild(div);
        });
    })
    .catch(err => {
        console.log(err);
    });

function goToDetails(roomId) {
    sessionStorage.setItem('room', roomId);
    window.location.href = 'details.html'; 
}
