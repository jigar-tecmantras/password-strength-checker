const passwordInput = document.getElementById("password-input");
const strengthBar = document.getElementById("strength-bar");
const strengthMeter = document.getElementById("strength-meter");
const strengthText = document.getElementById("strength-text");
const suggestionList = document.getElementById("suggestion-list");
const suggestionSummary = document.getElementById("suggestion-summary");

const dictionary = [
  "password",
  "123456",
  "qwerty",
  "letmein",
  "admin",
  "welcome",
  "iloveyou",
  "monkey",
  "dragon",
  "football",
];

const strengthLevels = [
  { minScore: 0, label: "Very Weak", color: "#f43f5e" },
  { minScore: 25, label: "Weak", color: "#fb923c" },
  { minScore: 50, label: "Fair", color: "#facc15" },
  { minScore: 70, label: "Strong", color: "#22c55e" },
  { minScore: 85, label: "Very Strong", color: "#0f9d58" },
];

const sequences = "abcdefghijklmnopqrstuvwxyz0123456789";
const reversedSequences = sequences.split("").reverse().join("");

function hasSequentialCharacters(value) {
  const lower = value.toLowerCase();
  for (let i = 0; i < lower.length - 2; i += 1) {
    const slice = lower.slice(i, i + 3);
    if (sequences.includes(slice) || reversedSequences.includes(slice)) {
      return true;
    }
  }
  return false;
}

function evaluatePassword(password) {
  if (!password) {
    return { score: 0, suggestions: [], reason: "empty" };
  }

  const lengthScore = Math.min(password.length, 20) * 2;
  let typePoints = 0;
  const types = [
    /[a-z]/,
    /[A-Z]/,
    /[0-9]/,
    /[^a-zA-Z0-9]/,
  ];

  types.forEach((pattern) => {
    if (pattern.test(password)) {
      typePoints += 8;
    }
  });

  const uniqueCount = new Set(password).size;
  const uniqueScore = Math.min(uniqueCount, 15) * 1.4;
  let score = lengthScore + typePoints + uniqueScore;

  if (password.length >= 15) {
    score += 5;
  }

  let dictionaryPenalty = 0;
  if (dictionary.some((word) => password.toLowerCase().includes(word))) {
    dictionaryPenalty = 10;
  }

  const hasSequence = hasSequentialCharacters(password);
  const repetitionPenalty = /(.)\1{2,}/.test(password) ? 10 : 0;

  score -= dictionaryPenalty;
  score -= hasSequence ? 10 : 0;
  score -= repetitionPenalty;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  const suggestions = [];
  if (password.length < 12) {
    suggestions.push("Increase the length to at least 12 characters.");
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push("Add lowercase letters.");
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push("Add uppercase letters.");
  }
  if (!/[0-9]/.test(password)) {
    suggestions.push("Include numbers.");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push("Add special characters (e.g., @, #, !).");
  }
  if (dictionaryPenalty) {
    suggestions.push("Avoid common words or leaked passwords.");
  }
  if (hasSequence) {
    suggestions.push("Break sequential patterns like abc or 123.");
  }
  if (repetitionPenalty) {
    suggestions.push("Avoid repeating the same character three times or more.");
  }

  const uniqueShortfall = Math.max(0, 6 - uniqueCount);
  if (uniqueShortfall > 0 && password.length >= 6) {
    suggestions.push("Use more unique characters to increase entropy.");
  }

  const normalizedSuggestions = Array.from(new Set(suggestions));

  return {
    score: finalScore,
    suggestions: normalizedSuggestions,
    reason: "calculated",
  };
}

function pickStrengthLevel(score) {
  for (let i = strengthLevels.length - 1; i >= 0; i -= 1) {
    if (score >= strengthLevels[i].minScore) {
      return strengthLevels[i];
    }
  }
  return strengthLevels[0];
}

function renderSuggestions(messages, password) {
  suggestionList.innerHTML = "";

  if (!password) {
    suggestionSummary.textContent = "Type a password to unlock customized tips.";
    const li = document.createElement("li");
    li.textContent = "Enter a password above to see its strength and suggestions.";
    suggestionList.appendChild(li);
    return;
  }

  if (messages.length === 0) {
    suggestionSummary.textContent = "This looks strong. Keep the pattern!";
    const li = document.createElement("li");
    li.innerHTML = "Good job! <strong>All core criteria are met.</strong>";
    suggestionList.appendChild(li);
    return;
  }

  suggestionSummary.textContent = "Start by addressing these areas to strengthen the password.";
  messages.forEach((message) => {
    const li = document.createElement("li");
    li.textContent = message;
    suggestionList.appendChild(li);
  });
}

function updateMeter(score, level) {
  strengthBar.style.width = `${score}%`;
  strengthBar.style.backgroundColor = level.color;
  strengthMeter.setAttribute("aria-valuenow", score);
}

function refreshUI(password) {
  if (!password) {
    strengthText.textContent = "Waiting for input…";
    strengthBar.style.width = "0";
    strengthBar.style.backgroundColor = "#94a3b8";
    strengthMeter.setAttribute("aria-valuenow", 0);
    renderSuggestions([], password);
    return;
  }

  const evaluation = evaluatePassword(password);
  const strengthLevel = pickStrengthLevel(evaluation.score);
  strengthText.textContent = `${strengthLevel.label} — ${evaluation.score}%`;
  updateMeter(evaluation.score, strengthLevel);
  renderSuggestions(evaluation.suggestions, password);
}

passwordInput.addEventListener("input", (event) => {
  refreshUI(event.target.value);
});

// Initialize with placeholder state
refreshUI("");
