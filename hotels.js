const ul = document.getElementById("CategroryList");
const section = document.querySelector("section");

function showAllHotels() {
    fetch("https://hotelbooking.stepprojects.ge/api/Hotels/GetCities")
        .then(res => res.json())
        .then(ulList => {

            ul.innerHTML = '<li class="active" onclick="fetchHotels()">All</li>';  

            ulList.forEach(list => {
                console.log(list)
                
                ul.innerHTML += `<li onclick="fetchHotels(${list.id})">${list}</li>`;
            });

            attachActiveClassHandler();
        });
}

function fetchHotels(cityId = null) {
    let url;

    if (cityId) {
        url = `https://hotelbooking.stepprojects.ge/api/Hotels/GetHotels?cityId=${cityId}`;
    } else {
        url = `https://hotelbooking.stepprojects.ge/api/Hotels/GetHotels?city=tbilisi`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            section.innerHTML = ''; 

            if (data && data.length > 0) {
                data.forEach(hotel => {
                    console.log(hotel);

                    const div = document.createElement("div");
                    div.classList.add("hotel");
                    div.innerHTML = `
                        <img src="${hotel.featuredImage}" alt="${hotel.name}">
                        <h2>${hotel.name}</h2>
                        <button onclick ="goToHotelRooms(${hotel.id})" class="viewRooms">VIEW ROOMS</button>
                    `;
                    section.appendChild(div);
                });
            } else {
                section.innerHTML = '<p>No hotels available for this city.</p>';
            }
        })
        .catch(err => {
            console.error('Error fetching hotels:', err);
            section.innerHTML = '<p>Failed to load hotels. Please try again later.</p>';
        });
}

function attachActiveClassHandler() {
    ul.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (event) => {
            ul.querySelectorAll('li').forEach(item => item.classList.remove('active')); 
            event.target.classList.add('active'); 
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    showAllHotels(); 
    fetchHotels();     
});
document.querySelectorAll('.hotel').forEach(hotel => {
    hotel.addEventListener('mouseover', () => {
    });
    hotel.addEventListener('mouseleave', () => {
    });
});

function goToHotelRooms(hotelId) {
    sessionStorage.setItem('hotelId', hotelId); 
    window.location.href = 'rooms.html';  
}