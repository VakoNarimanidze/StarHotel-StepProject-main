const table = document.querySelector("table");
const header = document.querySelector("header");

async function fetchRoomDetails(roomID) {
    try {
        const response = await fetch(`https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${roomID}`);
        const roomData = await response.json();
        return roomData; 
    } catch (error) {
        console.error("Error fetching room details:", error);
    }
}

async function fetchHotelDetails(hotelID) {
    try {
        const response = await fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${hotelID}`);
        const hotelData = await response.json();

        console.log('Hotel details fetched:', hotelData); 

        return hotelData; 
    } catch (error) {
        console.error("Error fetching hotel details:", error);
    }
}

async function fetchBookings() {
    try {
        const response = await fetch("https://hotelbooking.stepprojects.ge/api/Booking");
        const data = await response.json();
        console.log("Booking items:", data);

        for (const item of data) {
            const roomDetails = await fetchRoomDetails(item.roomID);
            const hotelDetails = await fetchHotelDetails(roomDetails?.hotelID); 

            if (!roomDetails || !hotelDetails) {
                console.error("Missing room or hotel details for booking:", item);
                continue;
            }

            // Format the check-in and check-out dates
            const formattedCheckInDate = new Date(item.checkInDate).toLocaleDateString();
            const formattedCheckOutDate = new Date(item.checkOutDate).toLocaleDateString();

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div>
                        <!-- Use a fallback value for missing hotel image -->
                        <img class="hotelImg" src="${hotelDetails.featuredImage || ''}" alt="${hotelDetails.name || 'Hotel'}">
                    </div>
                    <div>
                        <p class="hotelName">${hotelDetails.name || 'Hotel Name'}</p>
                        <p class="city">${hotelDetails.city || 'City'}</p>
                    </div>
                </td>
                <td>
                    <div>
                        <img class="roomImg" src="${roomDetails.images[0].source}" alt="${roomDetails.name || 'Room'}">
                    </div>
                    <div>
                        <p class="roomName">${roomDetails.name}</p>
                        <p class="roomPrice">${roomDetails.pricePerNight} €</p>
                    </div>
                </td>
                <td>
                    <div>
                        <p class="CostomerName">Name: ${item.customerName}</p>
                        <p class="CostomerPhoneNum">Phone: ${item.customerPhone}</p>
                    </div>
                </td>
                <td>
                    <span class="status">${item.isConfirmed ? 'Booked' : ''}</span>
                </td>
                <td class="checkIn">
                    ${formattedCheckInDate}
                </td>
                <td class="checkOut">
                    ${formattedCheckOutDate}
                </td>
                <td class="TotalPrice">
                    ${item.totalPrice}
                </td>
                <td>
                    <button onclick="cancelBooking(${item.id})" class="CancelBtn">
                        Cancel Booking
                    </button>
                </td>
            `;

            table.appendChild(row);
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

async function cancelBooking(bookingID) {
    try {
        console.log(`Attempting to cancel booking with ID: ${bookingID}`); 

        const response = await fetch(`https://hotelbooking.stepprojects.ge/api/Booking/${bookingID}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        console.log(`Response from cancelBooking API: ${response.status} - ${responseText}`);

        if (response.ok) {
            console.log(`Booking with ID ${bookingID} has been canceled.`);
            alert('Booking canceled successfully!');
            location.reload(); 
        } else {
            console.error(`Failed to cancel booking: ${response.status} - ${responseText}`);
            alert(`Failed to cancel booking: ${responseText}`);
        }
    } catch (error) {
        console.error("Error canceling booking:", error);
        alert(`Error canceling booking: ${error.message}`);
    }
}

fetchBookings();

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
