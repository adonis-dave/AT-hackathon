<a name="readme-top"></a>

<div align="center">
  <img src="murple_logo.png" alt="logo" width="140"  height="auto" />
  <br/>

  <h3><b>Cookie Guard</b></h3>
</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [❓ FAQ (OPTIONAL)](#faq)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# 📖 Cookie Guard <a name="about-project"></a>

**Cookie Guard** is a browser extension designed to enhance user privacy and security by blocking cookies, analyzing website risks, and providing detailed reports. It also includes features like ad blocking, redirection prevention, and popup blocking.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li>Flask (Python)</li>
  </ul>
</details>

<details>
<summary>Browser APIs</summary>
  <ul>
    <li>Chrome Extensions API</li>
    <li>WebRequest API</li>
    <li>Cookie API</li>
  </ul>
</details>

<!-- Features -->

### Key Features <a name="key-features"></a>

- **Cookie Blocking**: Removes cookies from websites to enhance privacy.
- **Risk Analysis**: Analyzes website permissions and cookies for potential risks.
- **Dark Mode**: Provides a toggle for light and dark themes.
- **Ad Blocking**: Blocks ads and prevents redirection chains.
- **SMS Reports**: Sends risk analysis reports via SMS.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Live Demo <a name="live-demo"></a>

- [Live Demo Link](https://example.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:

- A modern web browser (e.g., Chrome)
- Python installed on your system
- Flask library installed (`pip install flask`)

### Setup

Clone this repository to your desired folder:

```sh
  git clone https://github.com/adonis-dave/AT-hackathon.git
  cd AT-hackathon
```

### Install

Install the dependencies for the Flask server:

```sh
  pip install -r requirements.txt
```

### Usage

To run the project, execute the following command:

1. Start the Flask server:

   ```sh
   python Backend/server.py
   ```

2. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `Backend` folder.

### Run tests

To run tests, you can use the browser's developer tools to test the extension's functionality.

### Deployment

You can deploy this project by packaging the extension and uploading it to the Chrome Web Store.

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd AT-hackathon
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory with the following content:

   ```plaintext
   AFRICASTALKING_USERNAME=sandbox
   AFRICASTALKING_API_KEY=your_africastalking_api_key
   ```

   Replace `your_africastalking_api_key` with your actual API key.

4. Run the application:
   ```bash
   python server.py
   ```

## Notes

- The `.gitignore` file is configured to exclude sensitive files like `.env` and unnecessary files such as logs and temporary files.
- Ensure that the `.env` file is not shared or uploaded to version control systems.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 **Your Name**

- GitHub: [@yourgithubhandle](https://github.com/yourgithubhandle)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourlinkedinhandle)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

- [ ] **Enhanced Risk Analysis**
- [ ] **Multi-language Support**
- [ ] **Integration with Other Browsers**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/yourusername/cookies-guard/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

If you like this project, please give it a ⭐️ and share it with others!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGEMENTS -->

## 🙏 Acknowledgements <a name="acknowledgements"></a>

I would like to thank Microverse for providing the inspiration and guidance for this project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FAQ (optional) -->

## ❓ FAQ (OPTIONAL) <a name="faq"></a>

- **Can I use this extension on other browsers?**

  - Currently, it is designed for Chrome, but future updates may include support for other browsers.

- **How do I report a bug?**

  - Please open an issue on the GitHub repository.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./MIT.md) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
````
