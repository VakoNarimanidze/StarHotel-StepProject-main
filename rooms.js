const section = document.querySelector('section');
const priceRangeInput = document.getElementById('priceRange');
const roomTypeSelect = document.getElementById('roomType');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const guestsInput = document.getElementById('Guests');
const filterForm = document.getElementById('filterForm');
const priceDisplay = document.getElementById('priceDisplay');
const hotelid = sessionStorage.getItem("hotelId");

const categoryList = document.getElementById("CategoryList");

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
                fetchRoomsWithFilters();
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


function fetchRoomsWithFilters() {
    const roomTypeId = roomTypeSelect && roomTypeSelect.value !== 'All' ? roomTypeSelect.value : null;
    const fromPrice = parseInt(fromSlider.value);
    const toPrice = parseInt(toSlider.value);
    const checkIn = checkInInput ? checkInInput.value : null;
    const checkOut = checkOutInput ? checkOutInput.value : null;
    const guests = guestsInput ? parseInt(guestsInput.value) : null;

    const filters = {
        roomTypeId: roomTypeId || null,
        minPrice: fromPrice || null,
        maxPrice: toPrice || null,
        checkIn: checkIn || null,
        checkOut: checkOut || null,
        guests: guests || null
    };

    console.log("Applied filters:", filters);

    fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetFiltered', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Filtered Rooms:', data);
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

function fetchHotelRooms(hotelId) {
    console.log("Fetching rooms for hotel ID:", hotelId);

    fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${hotelId}`)
        .then(response => response.json())
        .then(infoData => {
            console.log("Fetched Rooms Data for Hotel:", infoData);

            let filteredRooms = infoData.rooms;
            filteredRooms = applyFilters(filteredRooms);

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

function applyFilters(rooms) {
    let filteredRooms = rooms;

    const fromPrice = parseInt(fromSlider.value);
    const toPrice = parseInt(toSlider.value);

    console.log("Price Range:", fromPrice, toPrice);

    filteredRooms = filteredRooms.filter(room => {
        console.log("Room Price:", room.pricePerNight);
        return room.pricePerNight >= fromPrice && room.pricePerNight <= toPrice;
    });
    console.log("After Price Range Filter:", filteredRooms);

    if (priceDisplay) {
        priceDisplay.innerText = `€ ${fromPrice} - € ${toPrice}`;
    }

    const selectedRoomTypeId = roomTypeSelect && roomTypeSelect.value !== 'All' ? roomTypeSelect.value : null;
    if (selectedRoomTypeId) {
        filteredRooms = filteredRooms.filter(room => room.roomTypeId === parseInt(selectedRoomTypeId));
    }

    console.log("After Room Type Filter:", filteredRooms);

    if (checkInInput && checkOutInput) {
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            filteredRooms = filteredRooms.filter(room => {
                const availableFrom = new Date(room.availableFrom);
                const availableUntil = new Date(room.availableUntil);
                return availableFrom <= checkInDate && availableUntil >= checkOutDate;
            });
        }
    }
    console.log("After Date Availability Filter:", filteredRooms);

    if (guestsInput) {
        const guests = parseInt(guestsInput.value);
        if (guests) {
            filteredRooms = filteredRooms.filter(room => room.guests >= guests);
        }
    }
    console.log("After Guests Filter:", filteredRooms);

    return filteredRooms;
}

function goToDetails(roomId) {
    sessionStorage.setItem("room", roomId);
    window.location.href = './details.html';
    console.log(roomId);
}

flatpickr("#checkOut", {
    dateFormat: "Y-m-d",
    placeholder: "Check-Out"
});
flatpickr("#checkIn", {
    dateFormat: "Y-m-d",
    placeholder: "Check-In"
});

const fromSlider = document.getElementById('fromSlider');
const toSlider = document.getElementById('toSlider');
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');

fromSlider.addEventListener('input', function () {
    fromInput.value = fromSlider.value;
    checkRange();
});

toSlider.addEventListener('input', function () {
    toInput.value = toSlider.value;
    checkRange();
});

fromInput.addEventListener('input', function () {
    fromSlider.value = fromInput.value;
    checkRange();
});

toInput.addEventListener('input', function () {
    toSlider.value = fromSlider.value;
    checkRange();
});

function checkRange() {
    if (parseInt(fromSlider.value) > parseInt(toSlider.value)) {
        fromSlider.value = toSlider.value;
        fromInput.value = toSlider.value;
    }
    if (parseInt(toSlider.value) < parseInt(fromSlider.value)) {
        toSlider.value = fromSlider.value;
        toInput.value = fromSlider.value;
    }
}

filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    fetchRoomsWithFilters();
});

if (!hotelid) {
    showAllRooms();
} else {
    fetchHotelRooms(hotelid);
}
