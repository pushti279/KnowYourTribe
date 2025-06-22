// Mobile menu toggle
document.querySelector(".icon-menu")?.addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.toggle("menu-open");
});

// FAQ accordion functionality
const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.login__tab');
  const forms = document.querySelectorAll('.login__form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and forms
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));

      // Add active class to clicked tab and corresponding form
      tab.classList.add('active');
      const formId = tab.getAttribute('data-tab');
      document.querySelector(`.form-${formId}`).classList.add('active');
    });
  });

  // Form submission handling
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          // Show success message
          showNotification('Login successful! Redirecting to dashboard...', 'success');
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        } else {
          showNotification(data.error || 'Login failed', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        showNotification('An error occurred during login', 'error');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Collect all form data with proper field names
      const formData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        interests: document.getElementById('interests').value,
        hobbies: document.getElementById('hobbies').value,
        about: document.getElementById('aboutYou').value,
        company: document.getElementById('company').value,
        role: document.getElementById('role').value,
        industry: document.getElementById('industry').value === 'other' 
          ? document.getElementById('otherIndustry').value 
          : document.getElementById('industry').value,
        experience: document.getElementById('experience').value,
        goals: document.getElementById('goals').value,
        targetAudience: document.getElementById('targetAudience').value,
        challenges: document.getElementById('challenges').value
      };

      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(result.user));
          // Show success message
          showNotification('Registration successful! Redirecting to dashboard...', 'success');
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        } else {
          showNotification(result.error || 'Registration failed', 'error');
        }
      } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred during registration', 'error');
      }
    });
  }

  // Add smooth scrolling for the signup form sections
  const sections = document.querySelectorAll('.form-signup__section');
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateX(0)';
    }, 100 * (index + 1));
  });

  // Add focus and blur effects for form inputs
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });

  // Handle industry dropdown
  const industrySelect = document.getElementById('industry');
  const otherIndustryGroup = document.getElementById('otherIndustryGroup');
  const otherIndustryInput = document.getElementById('otherIndustry');

  if (industrySelect && otherIndustryGroup) {
    industrySelect.addEventListener('change', function() {
      if (this.value === 'other') {
        otherIndustryGroup.style.display = 'block';
        otherIndustryInput.required = true;
      } else {
        otherIndustryGroup.style.display = 'none';
        otherIndustryInput.required = false;
      }
    });
  }
});

// Notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Add styles
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '15px 25px';
  notification.style.borderRadius = '5px';
  notification.style.color = 'white';
  notification.style.zIndex = '1000';
  notification.style.transition = 'opacity 0.3s ease';
  
  if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
  } else {
    notification.style.backgroundColor = '#f44336';
  }
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
