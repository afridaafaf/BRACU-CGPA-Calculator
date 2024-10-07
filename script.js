// Calculate Current Semester's CGPA
function calculateCurrentCGPA() {
    let previousCGPA = parseFloat(document.getElementById('previousCGPA').value);
    let previousCredits = parseInt(document.getElementById('previousCredits').value);
    let grades = document.getElementById('grades') ? document.getElementById('grades').value.split(',').map(Number) : [];
    let numCourses = parseInt(document.getElementById('numCourses').value);

    // Get grades from dynamically generated select boxes if no direct grade input
    if (grades.length === 0) {
        for (let i = 1; i <= numCourses; i++) {
            let grade = parseFloat(document.getElementById(`grade${i}`).value);
            grades.push(grade);
        }
    }

    // Step 1: Calculate GPA for this semester
    let gpaThisSemester = grades.reduce((sum, grade) => sum + grade, 0) / numCourses;
    let creditsThisSemester = numCourses * 3;
    let totalCreditsCompleted = previousCredits + creditsThisSemester;

    // Step 2: Calculate updated CGPA
    let updatedCGPA = ((previousCGPA * previousCredits) + (gpaThisSemester * creditsThisSemester)) / totalCreditsCompleted;

    // Display the result
    document.getElementById('currentCGPAResult').innerText = `Your updated CGPA is: ${updatedCGPA.toFixed(2)}`;
}

// Calculate Required GPA and Display Multiple Combinations for Desired CGPA
function calculateDesiredCGPA() {
    let currentCGPA = parseFloat(document.getElementById("currentCGPA").value);
    let desiredCGPA = parseFloat(document.getElementById("desiredCGPA").value);
    let previousCredits = parseInt(document.getElementById('previousCredits').value);
    let numCoursesNext = parseInt(document.getElementById("nextCourses").value);

    if (isNaN(currentCGPA) || isNaN(desiredCGPA) || isNaN(numCoursesNext) || isNaN(previousCredits)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Calculate total credits and required GPA for the next semester
    let creditsNextSemester = numCoursesNext * 3;
    let totalCreditsAfterNextSemester = previousCredits + creditsNextSemester;

    // Required GPA for the next semester to achieve desired CGPA
    let requiredGPA = ((desiredCGPA * totalCreditsAfterNextSemester) - (currentCGPA * previousCredits)) / creditsNextSemester;

    // Display the required GPA
    document.getElementById('desiredCGPAResult').innerText = `To achieve a CGPA of ${desiredCGPA}, you need to average a GPA of ${requiredGPA.toFixed(2)} in the next semester.`;

    // Generate multiple grade combinations
    generateGradeCombinations(requiredGPA, numCoursesNext);
}

// Generate Grade Combinations
function generateGradeCombinations(requiredGPA, numCoursesNext) {
    let gradeOptions = [4.0, 3.7, 3.3, 3.0, 2.7, 2.3]; // Realistic grades from A+ to C+
    let combinations = [];

    // Generate possible grade combinations that average to the required GPA
    function generateCombos(combo, start) {
        if (combo.length === numCoursesNext) {
            let sum = combo.reduce((a, b) => a + b, 0);
            let avg = sum / numCoursesNext;

            // We allow a small tolerance for rounding issues (e.g., 0.05)
            if (Math.abs(avg - requiredGPA) <= 0.05) {
                combinations.push([...combo]);
            }
            return;
        }
        for (let i = start; i < gradeOptions.length; i++) {
            combo.push(gradeOptions[i]);
            generateCombos(combo, i);
            combo.pop();
        }
    }

    generateCombos([], 0);

    // Display grade combinations
    let gradeCombinationsDiv = document.getElementById('gradeCombinations');
    gradeCombinationsDiv.innerHTML = '<h3>Possible Grade Combinations for Achieving Your Desired CGPA:</h3>';
    
    if (combinations.length === 0) {
        gradeCombinationsDiv.innerHTML += "<p>No exact combinations found. Try adjusting the desired CGPA.</p>";
    } else {
        combinations.forEach((combo, index) => {
            let formattedCombo = combo.map(grade => `Grade: ${grade.toFixed(1)}`).join(', ');
            gradeCombinationsDiv.innerHTML += `<p>Combination ${index + 1}: ${formattedCombo}</p>`;
        });
    }
}

// Validation for Previous CGPA (Between 0 and 4)
function validateCGPA(inputId, errorId) {
    let cgpaInput = parseFloat(document.getElementById(inputId).value);
    let cgpaError = document.getElementById(errorId);

    if (isNaN(cgpaInput) || cgpaInput < 0 || cgpaInput > 4) {
        cgpaError.style.display = "block";
    } else {
        cgpaError.style.display = "none";
    }
}

// Validate Previous CGPA for Current Semester (Between 0 and 4)
function validateCurrentCGPA() {
    validateCGPA("currentCGPA", "currentCGPAError");
}

// Validate Desired CGPA for Next Semester (Between 0 and 4)
function validateDesiredCGPA() {
    validateCGPA("desiredCGPA", "desiredCGPAError");
}

// Validation for Total Credits (Must be divisible by 3)
function validateCredits() {
    let creditsInput = parseInt(document.getElementById("previousCredits").value);
    let creditsError = document.getElementById("creditsError");

    if (isNaN(creditsInput) || creditsInput % 3 !== 0 || creditsInput <= 0) {
        creditsError.style.display = "block";
    } else {
        creditsError.style.display = "none";
    }
}

// Dynamic Grade Inputs Based on Number of Courses Selected
function generateGradeInputs() {
    let numCourses = document.getElementById("numCourses").value;
    let gradeInputs = document.getElementById("gradeInputs");
    gradeInputs.innerHTML = '';  // Clear previous inputs if any

    // Grade options based on the image provided
    let gradeOptions = `
        <option value="4.0">A+ / A (4.0)</option>
        <option value="3.7">A- (3.7)</option>
        <option value="3.3">B+ (3.3)</option>
        <option value="3.0">B (3.0)</option>
        <option value="2.7">B- (2.7)</option>
        <option value="2.3">C+ (2.3)</option>
        <option value="2.0">C (2.0)</option>
        <option value="1.7">D+ (1.7)</option>
        <option value="1.3">D (1.3)</option>
        <option value="0.0">F (0.0)</option>
    `;

    // Generate select boxes for each course
    for (let i = 1; i <= numCourses; i++) {
        gradeInputs.innerHTML += `
            <label for="grade${i}">Grade for Course ${i}:</label>
            <select id="grade${i}">
                ${gradeOptions}
            </select><br><br>
        `;
    }
}
