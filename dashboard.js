document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Display user name
  document.getElementById('userName').textContent = user.name;

  // Initialize all charts and interactive elements
  initializeCharts();
  initializeQuickStats();
  initializeFilters();
  initializeActivityFeed();
  setupLogout();

  // Update data periodically
  setInterval(updateDashboardData, 30000); // Update every 30 seconds
});

function initializeQuickStats() {
  // Simulate dynamic data
  const stats = {
    totalConnections: Math.floor(Math.random() * 1000) + 500,
    growthRate: (Math.random() * 20 + 5).toFixed(1),
    matchScore: (Math.random() * 30 + 70).toFixed(1)
  };

  document.getElementById('totalConnections').textContent = stats.totalConnections;
  document.getElementById('growthRate').textContent = `${stats.growthRate}%`;
  document.getElementById('matchScore').textContent = `${stats.matchScore}%`;
}

function initializeCharts() {
  // Community Reach Chart
  const reachCtx = document.getElementById('reachChart').getContext('2d');
  new Chart(reachCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Community Reach',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#4CAF50',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(76, 175, 80, 0.1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Target Matches Chart
  const matchesCtx = document.getElementById('matchesChart').getContext('2d');
  new Chart(matchesCtx, {
    type: 'bar',
    data: {
      labels: ['Tech', 'Finance', 'Healthcare', 'Education', 'Retail'],
      datasets: [{
        label: 'Potential Matches',
        data: [12, 19, 3, 5, 2],
        backgroundColor: '#2196F3'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons in the same group
      this.parentElement.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      // Add active class to clicked button
      this.classList.add('active');
      // Update chart data based on selected period
      updateChartData(this.dataset.period);
    });
  });
}

function updateChartData(period) {
  // Simulate different data based on selected period
  const data = {
    week: [10, 20, 30, 40, 50, 60, 70],
    month: [30, 40, 50, 60, 70, 80, 90],
    quarter: [50, 60, 70, 80, 90, 100, 110],
    year: [70, 80, 90, 100, 110, 120, 130]
  };

  // Update the trends chart with new data
  const trendsChart = Chart.getChart(document.getElementById('trendsChart'));
  trendsChart.data.datasets[0].data = data[period];
  trendsChart.update();
}

function initializeActivityFeed() {
  const activities = [
    { type: 'connection', text: 'New connection with TechStart Inc.', time: '2 hours ago' },
    { type: 'engagement', text: 'High engagement on your latest post', time: '4 hours ago' },
    { type: 'match', text: 'New potential match found', time: '6 hours ago' },
    { type: 'analysis', text: 'Community analysis completed', time: '1 day ago' }
  ];

  const activityFeed = document.getElementById('activityFeed');
  activities.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.className = `activity-item activity-item--${activity.type}`;
    activityItem.innerHTML = `
      <div class="activity-icon">${getActivityIcon(activity.type)}</div>
      <div class="activity-content">
        <p class="activity-text">${activity.text}</p>
        <span class="activity-time">${activity.time}</span>
      </div>
    `;
    activityFeed.appendChild(activityItem);
  });
}

function getActivityIcon(type) {
  const icons = {
    connection: '🤝',
    engagement: '💬',
    match: '🎯',
    analysis: '📊'
  };
  return icons[type] || '📌';
}

function updateDashboardData() {
  // Update quick stats
  initializeQuickStats();

  // Update trend indicators
  updateTrendIndicators();

  // Update community insights
  updateCommunityInsights();
}

function updateTrendIndicators() {
  const trends = ['reachTrend', 'engagementTrend', 'matchesTrend'];
  trends.forEach(trendId => {
    const trend = Math.random() * 20 - 10; // Random value between -10 and 10
    const element = document.getElementById(trendId);
    const icon = element.querySelector('.trend-icon');
    const value = element.querySelector('.trend-value');

    icon.textContent = trend >= 0 ? '↑' : '↓';
    icon.style.color = trend >= 0 ? '#4CAF50' : '#F44336';
    value.textContent = `${Math.abs(trend).toFixed(1)}%`;
  });
}

function updateCommunityInsights() {
  const insights = {
    activeMembers: Math.floor(Math.random() * 1000) + 2000,
    conversations: Math.floor(Math.random() * 500) + 1000,
    contentReach: Math.floor(Math.random() * 20000) + 40000
  };

  // Update insight values
  document.querySelectorAll('.insight-content p').forEach((element, index) => {
    const values = Object.values(insights);
    element.textContent = `${values[index].toLocaleString()}+ ${index === 0 ? 'daily active users' : index === 1 ? 'daily interactions' : 'monthly views'}`;
  });

  // Update trend indicators
  document.querySelectorAll('.insight-trend').forEach(trend => {
    const value = (Math.random() * 20 - 5).toFixed(1);
    const isPositive = value >= 0;
    trend.className = `insight-trend ${isPositive ? 'positive' : 'negative'}`;
    trend.querySelector('.trend-icon').textContent = isPositive ? '↑' : '↓';
    trend.querySelector('.trend-value').textContent = `${Math.abs(value)}%`;
  });
}

function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });
} 