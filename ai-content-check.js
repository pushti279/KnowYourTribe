// AI Content Detection and Form Validation
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signupForm');
  const textareas = document.querySelectorAll('textarea[data-ai-check="true"]');
  
  // Function to count words
  function countWords(text) {
    return text.trim().split(/\s+/).length;
  }
  
  // Function to check AI content with more comprehensive detection
  function checkAIContent(text) {
    // Common AI-generated content patterns with weights
    const aiPatterns = [
      // High-weight patterns (ChatGPT signature phrases)
      { pattern: /\b(as an AI|as a language model|I am an AI|I am a language model)\b/gi, weight: 3 },
      { pattern: /\b(I understand|I can help|I would recommend|I suggest|I recommend)\b/gi, weight: 2 },
      { pattern: /\b(here's how|here is how|let me explain|let me help you)\b/gi, weight: 2 },
      { pattern: /\b(please note|please be aware|please keep in mind)\b/gi, weight: 2 },
      { pattern: /\b(to begin with|firstly|secondly|thirdly|finally)\b/gi, weight: 2 },
      { pattern: /\b(it is worth noting|it is important to understand|it should be emphasized)\b/gi, weight: 2 },
      
      // Medium-weight patterns (Formal language)
      { pattern: /\b(furthermore|additionally|consequently|therefore|thus|moreover|subsequently|previously|aforementioned|hence)\b/gi, weight: 1.5 },
      { pattern: /\b(it is important to note|it should be noted|it is worth mentioning|it is crucial to understand)\b/gi, weight: 1.5 },
      { pattern: /\b(in conclusion|to summarize|in summary|in brief|in short)\b/gi, weight: 1.5 },
      
      // Lower-weight patterns (Generic descriptors)
      { pattern: /\b(perfectly|exactly|precisely|specifically)\b/gi, weight: 1 },
      { pattern: /\b(interesting|fascinating|remarkable|notable|significant)\b/gi, weight: 1 },
      { pattern: /\b(in addition|additionally|moreover|furthermore|consequently)\b/gi, weight: 1 }
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    let weightedMatches = 0;
    let totalWords = words.length;
    
    // Check for pattern matches with weights
    aiPatterns.forEach(({ pattern, weight }) => {
      const matches = text.match(pattern) || [];
      weightedMatches += matches.length * weight;
    });
    
    // Count individual AI-like words with weights
    const aiWords = {
      // High-weight words
      'understand': 2, 'recommend': 2, 'suggest': 2, 'explain': 2, 'help': 2,
      'note': 2, 'aware': 2, 'mind': 2, 'begin': 2, 'worth': 2, 'important': 2,
      'emphasize': 2,
      
      // Medium-weight words
      'furthermore': 1.5, 'additionally': 1.5, 'consequently': 1.5, 'therefore': 1.5,
      'thus': 1.5, 'moreover': 1.5, 'subsequently': 1.5, 'previously': 1.5,
      'aforementioned': 1.5, 'hence': 1.5,
      
      // Lower-weight words
      'perfectly': 1, 'exactly': 1, 'precisely': 1, 'specifically': 1,
      'interesting': 1, 'fascinating': 1, 'remarkable': 1, 'notable': 1,
      'significant': 1, 'addition': 1, 'firstly': 1, 'secondly': 1, 'thirdly': 1,
      'finally': 1
    };
    
    words.forEach(word => {
      if (aiWords[word]) {
        weightedMatches += aiWords[word];
      }
    });
    
    // Calculate base percentage
    const basePercentage = (weightedMatches / totalWords) * 100;
    
    // Check for ChatGPT-like structure
    const hasChatGPTStructure = (
      text.includes('Here\'s') || 
      text.includes('Let me') || 
      text.includes('I can') ||
      text.includes('Please') ||
      text.includes('To begin') ||
      text.includes('In conclusion') ||
      text.includes('I understand') ||
      text.includes('I recommend') ||
      text.includes('I suggest')
    );
    
    // Check for perfect grammar and structure
    const hasPerfectGrammar = (
      text.match(/^[A-Z].*[.!?]$/gm)?.length > 0 && // Sentences start with capital and end with punctuation
      text.match(/\b(and|but|or|so|yet)\b/gi)?.length > 0 && // Has conjunctions
      text.match(/\b(the|a|an)\b/gi)?.length > 0 // Has articles
    );
    
    // Calculate final percentage with boosts
    let finalPercentage = basePercentage;
    
    // Add structure boost
    if (hasChatGPTStructure) {
      finalPercentage += 40;
    }
    
    // Add grammar boost
    if (hasPerfectGrammar) {
      finalPercentage += 20;
    }
    
    // Cap at 100%
    finalPercentage = Math.min(finalPercentage, 100);
    
    return Math.round(finalPercentage);
  }
  
  // Function to update AI content percentage and visual feedback
  function updateAIContent(textarea) {
    const wrapper = textarea.closest('.form-signup__input-wrapper');
    const percentageElement = wrapper.querySelector('.ai-content__percentage');
    const warningElement = wrapper.querySelector('.ai-content__warning');
    const text = textarea.value;
    const wordCount = countWords(text);
    
    // Reset classes
    textarea.classList.remove('valid', 'invalid');
    percentageElement.classList.remove('high');
    warningElement.style.display = 'none';
    
    if (text.length === 0) {
      percentageElement.textContent = 'AI Content: 0%';
      return true;
    }
    
    if (wordCount < 100) {
      percentageElement.textContent = `Words: ${wordCount}/100`;
      percentageElement.classList.add('high');
      textarea.classList.add('invalid');
      warningElement.style.display = 'block';
      return false;
    }
    
    const aiPercentage = checkAIContent(text);
    percentageElement.textContent = `AI Content: ${aiPercentage}%`;
    
    if (aiPercentage > 45) {
      percentageElement.classList.add('high');
      textarea.classList.add('invalid');
      warningElement.style.display = 'block';
      return false;
    }
    
    textarea.classList.add('valid');
    return true;
  }
  
  // Add input event listeners to textareas
  textareas.forEach(textarea => {
    textarea.addEventListener('input', () => updateAIContent(textarea));
    // Initial check
    updateAIContent(textarea);
  });
  
  // Form submission validation
  form.addEventListener('submit', function(e) {
    let isValid = true;
    
    textareas.forEach(textarea => {
      if (!updateAIContent(textarea)) {
        isValid = false;
        e.preventDefault();
      }
    });
    
    if (!isValid) {
      alert('Please ensure all text fields are at least 100 words and contain less than 45% AI-generated content.');
    }
  });
}); 