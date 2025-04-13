document.getElementById('createRobotForm').addEventListener('submit', async e => {
    e.preventDefault();

    const robotType = document.getElementById('robotType').value;
    const robotNamespace = document.getElementById('robotNamespace').value;
    const robotStatus = document.getElementById('robotStatus').checked;

    console.log('Creating robot:', {
        robotType,
        robotNamespace,
        robotStatus
    });

    const response = await fetch("http://localhost:8000/frontend/robot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            robotType,
            robotNamespace,
            robotStatus
        })
    })

    if(!response.ok) {
        alert('Failed to create robot');
        return;
    }

    location.reload();
});

async function toggleStatus(id) {
    await fetch(`http://localhost:8000/frontend/robot/${id}/toggle`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const rows = document.getElementById('robotTableBody').children;
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].children;
        
        if (cells[0].textContent == id) {
            const statusCell = cells[3].children[0];
            const actionButton = cells[4].children[0];
            
            const isCurrentlyActive = statusCell.classList.contains('status-active');
            
            if (isCurrentlyActive) {
                statusCell.classList.remove('status-active');
                statusCell.classList.add('status-inactive');
                statusCell.textContent = 'Inactive';
                
                actionButton.style.backgroundColor = '#2ecc71';
                actionButton.textContent = 'Activate';
            } else {
                statusCell.classList.remove('status-inactive');
                statusCell.classList.add('status-active');
                statusCell.textContent = 'Active';
                
                actionButton.style.backgroundColor = '#e74c3c';
                actionButton.textContent = 'Deactivate';
            }
            
            break;
        }
    }
}

async function getAllRobots() {
    const response = await fetch("http://localhost:8000/frontend/robot/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(!response.ok) {
        alert('Failed to fetch robots');
        return;
    }

    const robots = await response.json();

    const robotTableBody = document.getElementById('robotTableBody');

    robots.forEach(robot => {
        console.log(robot)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${robot.robotID}</td>
            <td>${robot.robotType}</td>
            <td>${robot.robotNamespace}</td>
            <td><span class="${robot.robotStatus ? 'status-active' : 'status-inactive'}">${robot.robotStatus ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button class="${robot.robotStatus ? 'danger-btn' : 'success-btn'}"
                    onclick="toggleStatus(${robot.robotID})">
                    ${robot.robotStatus ? 'Deactivate' : 'Activate'}
                </button>
            </td>
        `;

        robotTableBody.appendChild(row);
    });
}

window.onload = getAllRobots;