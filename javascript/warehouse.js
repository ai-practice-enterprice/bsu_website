async function loadWarehouseMap() {
    const response = await fetch("http://localhost:8000/frontend/zone/map_warehouse", {
        method: "POST",
    });

    if (!response.ok) {
        alert('Failed to fetch the map');
        return;
    } else {
        console.log("Map fetched successfully");
        const svgText = await response.text();
        const svgPlaceHolder = document.getElementById("warehouse_map")
        svgPlaceHolder.innerHTML = svgText;

        console.log("SVG loaded successfully");
        addZoneClickHandlers(svgPlaceHolder);
    }
}

function addZoneClickHandlers(svgPlaceHolder) {
    const zones = svgPlaceHolder.querySelectorAll("rect");

    zones.forEach(zone => {
        zone.addEventListener("click", async () => {
            const zoneId = zone.getAttribute("id");
            if (zoneId) {
                await fetchZoneData(zoneId);
            } else {
                console.error("Zone ID not found for clicked zone");
            }
        });
    });
}

async function fetchZoneData(zoneId) {
    try {
        const response = await fetch(`http://localhost:8000/frontend/zone/data/${zoneId}`, {
            method: "PATCH",
        });

        if (!response.ok) {
            alert('Failed to fetch zone data');
            return;
        }

        const zoneData = await response.json();
        displayZoneData(zoneData);
    } catch (error) {
        console.error("Error fetching zone data:", error);
    }
}

function displayZoneData(zone) {
    const zoneDataContainer = document.querySelector(".zonedata");
    // Determine badge class based on zone type
    let badgeClass = 'badge-dropzone';
    if (zone.zoneType.includes('pickup')) {
        badgeClass = 'badge-pickup';
    } else if (zone.zoneType.includes('storage')) {
        badgeClass = 'badge-storage';
    }
    
    const zoneCard = document.createElement('div');
    zoneCard.className = 'zone-card';
    zoneCard.innerHTML = `
        <h3>${zone.zoneName}</h3>
        <div class="zone-details">
            <p><span class="badge ${badgeClass}">${zone.zoneType}</span></p>
            <p>${zone.zoneDescription}</p>
            <p>Status: <span class="${zone.zoneCheck ? 'status-unavailable' : 'status-available'}">${zone.zoneCheck ? 'Occupied' : 'Available'}</span></p>
        </div>
        
        <div class="zone-actions">
            ${zone.zoneCheck 
                ? `<button class="danger-btn" onclick="exitZone(${zone.zoneID})">Exit Zone</button>`
                : `<button class="success-btn" onclick="enterZone(${zone.zoneID})">Enter Zone</button>`
            }
        </div>
    `;
    zoneDataContainer.innerHTML = zoneCard.outerHTML
}

window.onload = function() {
    loadWarehouseMap();
};