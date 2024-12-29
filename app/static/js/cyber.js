// Charts
const ctx1 = document.getElementById('csBreakdownChart').getContext('2d');
const ctx2 = document.getElementById('responseTimeChart').getContext('2d');
const ctx3 = document.getElementById('csatChart').getContext('2d');

new Chart(ctx1, {
  type: 'doughnut',
  data: {
    labels: ['Facebook', 'instagram', 'Twitter', 'Linkedin'],
    datasets: [{
      data: [10, 5, 35, 30],
      backgroundColor: ['#ff9800', '#e91e63', '#4caf50', '#03a9f4'],
    }],
  },
});

new Chart(ctx2, {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat','Sun'],
    datasets: [{
      label: 'Average Fake Accounts',
      data: [15, 10, 8, 12, 9, 7 , 9],
      borderColor: '#03a9f4',
      tension:0.4,
      fill: false,
    }],
  },
});

new Chart(ctx3, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
    datasets: [{
      label: 'CSAT',
      data: [60, 65, 70, 75, 80, 85, 70, 80 , 60 , 50 , 20, 70],
      backgroundColor: '#4caf50',
    }],
  },
});
//
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");

  // Load the saved theme from localStorage and apply it
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.checked = true;
    
  }

  // Toggle theme when the switch is clicked
  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-theme");
    const isLightMode = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
  });
});
document.getElementById("cyberreport").addEventListener('click', function () {
  window.location = "cyberreport"
})

document.getElementById("cyberhistory").addEventListener('click', function () {
  window.location = "cyberhistory"
})