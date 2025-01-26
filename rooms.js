const section = document.querySelector('section');
const priceRangeInput = document.getElementById('priceRange');
const roomTypeSelect = document.getElementById('roomType');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const guestsInput = document.getElementById('Guests');
const filterForm = document.getElementById('filterForm');
const priceDisplay = document.getElementById('priceDisplay');
const hotelid = sessionStorage.getItem("hotelId");
const header = document.querySelector('header');
const categoryList = document.getElementById("CategoryList");
const form = document.querySelector('form');

console.log("Hotel ID from sessionStorage:", hotelid);

if (!hotelid) {
    console.log("No hotel selected. Showing all rooms.");
}

fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes')
    .then(response => response.json())
    .then(roomTypes => {
        console.log("Room Types:", roomTypes);
        roomTypes.forEach(roomType => {
            const li = document.createElement("li");
            li.innerText = roomType.name;
            li.addEventListener("click", function () {
                roomTypeSelect.value = roomType.id;
                fetchRoomsByType(roomType.id); 
                setActiveCategory(li);
            });
            categoryList.appendChild(li);
        });

        const allCategory = document.createElement("li");
        allCategory.innerText = "All";
        allCategory.addEventListener("click", function () {
            roomTypeSelect.value = 'All';
            showAllRooms(); 
            setActiveCategory(allCategory);
        });
        categoryList.prepend(allCategory); 
        allCategory.classList.add('active');
    })
    .catch(error => {
        console.log('Error fetching room types:', error);
    });

function setActiveCategory(activeCategory) {
    const categoryItems = categoryList.querySelectorAll('li');
    categoryItems.forEach(item => item.classList.remove('active'));
    activeCategory.classList.add('active');
}

function fetchRoomsByType(roomTypeId) {
    console.log(`Fetching rooms for room type ID: ${roomTypeId}`);

    fetch(`https://hotelbooking.stepprojects.ge/api/Rooms/GetFiltered?roomTypeId=${roomTypeId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Rooms for selected room type:', data);
            section.innerHTML = ''; 

            if (data && data.length > 0) {
                data.forEach(room => {
                    const div = document.createElement('div');
                    div.classList.add('room');
                    div.innerHTML = ` 
                        <div class="room">
                            <div class="room-image">
                                <img src="${room.images[0] ? room.images[0].source : 'fallback-image.jpg'}" alt="Room">
                            </div>
                            <div class="room-info">
                                <h3>${room.name}</h3>
                                <p>€ ${room.pricePerNight} <span>a night</span></p>
                            </div>
                            <button onclick="goToDetails(${room.id})" class="book-now">BOOK NOW</button>
                        </div>
                    `;
                    section.appendChild(div);
                });
            } else {
                section.innerHTML = `<p>No rooms match your selected room type</p>`;
            }
        })
        .catch(error => {
            console.log('Error fetching rooms:', error);
        });
}

function showAllRooms() {
    fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll')
        .then(response => response.json())
        .then(data => {
            console.log('All Rooms:', data);
            section.innerHTML = ''; 

            data.forEach(room => {
                const div = document.createElement('div');
                div.classList.add('room');
                div.innerHTML = ` 
                    <div class="room">
                        <div class="room-image">
                            <img src="${room.images[0] ? room.images[0].source : 'fallback-image.jpg'}" alt="Room">
                        </div>
                        <div class="room-info">
                            <h3>${room.name}</h3>
                            <p>€ ${room.pricePerNight} <span>a night</span></p>
                        </div>
                        <button onclick="goToDetails(${room.id})" class="book-now">BOOK NOW</button>
                    </div>
                `;
                section.appendChild(div);
            });
        })
        .catch(error => {
            console.log('Error fetching rooms:', error);
        });
}

filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const selectedRoomType = roomTypeSelect.value;
    const formData = new FormData(form);
    const finalForm = Object.fromEntries(formData);
    
    console.log("Form filters:", finalForm); 
    
    if (selectedRoomType !== 'All') {
        finalForm.roomTypeId = selectedRoomType;
    } else {
        delete finalForm.roomTypeId;
    }

    fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetFiltered", {
        method: "POST",
        headers: {
            accept: "text/plain",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(finalForm)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        section.innerHTML = ''; 

        if (data && data.length > 0) {
            data.forEach(room => {
                const div = document.createElement('div');
                div.classList.add('room');
                div.innerHTML = ` 
                    <div class="room">
                        <div class="room-image">
                            <img src="${room.images[0] ? room.images[0].source : 'fallback-image.jpg'}" alt="Room">
                        </div>
                        <div class="room-info">
                            <h3>${room.name}</h3>
                            <p>€ ${room.pricePerNight} <span>a night</span></p>
                        </div>
                        <button onclick="goToDetails(${room.id})" class="book-now">BOOK NOW</button>
                    </div>
                `;
                section.appendChild(div);
            });
        } else {
            section.innerHTML = `<p>No rooms match your filters</p>`;
        }
    })
    .catch(error => {
        console.log('Error fetching rooms:', error);
    });
});

function fetchHotelRooms(hotelId) {
    console.log("Fetching rooms for hotel ID:", hotelId);

    fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${hotelId}`)
        .then(response => response.json())
        .then(infoData => {
            console.log("Fetched Rooms Data for Hotel:", infoData);

            let filteredRooms = infoData.rooms;
            // filteredRooms = applyFilters(filteredRooms);

            if (filteredRooms.length === 0) {
                section.innerHTML = `<p>No rooms match your filters</p>`;
                console.log("No rooms match the filters.");
                return;
            }

            section.innerHTML = '';
            console.log("Filtered Rooms:", filteredRooms);

            filteredRooms.forEach(room => {
                const div = document.createElement('div');
                div.classList.add('room');
                div.innerHTML = `
                    <div class="room">
                        <div class="room-image">
                            <img src="${room.images[0] ? room.images[0].source : 'fallback-image.jpg'}" alt="Room">
                        </div>
                        <div class="room-info">
                            <h3>${room.name}</h3>
                            <p>€ ${room.pricePerNight} <span>a night</span></p>
                        </div>
                        <button onclick="goToDetails(${room.id})" class="book-now">BOOK NOW</button>
                    </div>
                `;
                section.appendChild(div);
            });
        })
        .catch(err => {
            console.log('Error fetching rooms:', err);
        });
}

function goToDetails(roomId) {
    sessionStorage.setItem("room", roomId);
    window.location.href = './details.html';
    console.log(roomId);
}

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



if (!hotelid) {
    showAllRooms();
} else {
    fetchHotelRooms(hotelid);
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

const priceFrom = document.getElementById('priceFrom');
const priceTo = document.getElementById('priceTo');
const priceFromValue = document.getElementById('priceFromValue');
const priceToValue = document.getElementById('priceToValue');
const progress = document.querySelector('.progress');

// Function to update the progress bar and sync input fields
function updatePriceRangeBackground() {
    let fromValue = parseInt(priceFrom.value);
    let toValue = parseInt(priceTo.value);

    // Ensure min value is not greater than max value
    if (fromValue > toValue) {
        priceFrom.value = toValue;
        fromValue = toValue;
    }
    if (toValue < fromValue) {
        priceTo.value = fromValue;
        toValue = fromValue;
    }

    priceFromValue.value = fromValue;
    priceToValue.value = toValue;

    updateProgressBar();
}

function updateProgressBar() {
    const minValue = parseInt(priceFrom.min);
    const maxValue = parseInt(priceFrom.max);
    const leftPercent = ((priceFrom.value - minValue) / (maxValue - minValue)) * 100;
    const rightPercent = ((priceTo.value - minValue) / (maxValue - minValue)) * 100;

    progress.style.left = leftPercent + '%';
    progress.style.width = (rightPercent - leftPercent) + '%';
    progress.style.backgroundColor = '75C5CF';
}

function handleInputChange() {
    let fromValue = parseInt(priceFromValue.value) || 0;
    let toValue = parseInt(priceToValue.value) || 0;

    if (fromValue < priceFrom.min) fromValue = parseInt(priceFrom.min);
    if (toValue > priceTo.max) toValue = parseInt(priceTo.max);

    if (fromValue > toValue) {
        fromValue = toValue;
    }
    if (toValue < fromValue) {
        toValue = fromValue;
    }

    priceFrom.value = fromValue;
    priceTo.value = toValue;

    updatePriceRangeBackground();
}

priceFrom.addEventListener('input', updatePriceRangeBackground);
priceTo.addEventListener('input', updatePriceRangeBackground);

priceFromValue.addEventListener('input', handleInputChange);
priceToValue.addEventListener('input', handleInputChange);

updatePriceRangeBackground();

const burgerIcon = document.querySelector('.burger-icon');
const navLinks = document.querySelector('.nav-links');

burgerIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
