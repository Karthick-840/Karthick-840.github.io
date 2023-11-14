/* Reset some default styles */
body, h1, h2, h3, p {
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    background-color: #f4f4f4;
    color: #333;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

header h1 {
    color: #007bff;
}

section {
    margin-bottom: 30px;
}

/* Style for GitHub repositories */
.repo {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;
}

.repo h2 {
    color: #333;
}

.repo p {
    color: #666;
}

/* Style for releases, achievements, and certifications */
.release, .achievement, .certification {
    background-color: #fff;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 20px;
}

/* Style for CV section */
.cv {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 30px;
}

/* Footer styles */
footer {
    text-align: center;
    padding-top: 20px;
    background-color: #333;
    color: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
}

/* Responsive styles */
@media (max-width: 600px) {
    .container {
        padding: 10px;
    }
}
