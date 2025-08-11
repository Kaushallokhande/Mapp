# My React Native App

## Overview
This project is a React Native application designed to manage group expenses. It provides features for adding expenses, viewing group details, and settling expenses among members.

## Project Structure
```
my-react-native-app
├── src
│   ├── assets
│   │   └── fonts
│   ├── components
│   │   ├── AppButton.js
│   │   ├── AppHeader.js
│   │   ├── InputField.js
│   │   └── GroupCard.js
│   ├── context
│   │   └── AppContext.js
│   ├── hooks
│   │   └── useLocalStorage.js
│   ├── navigation
│   │   └── AppNavigator.js
│   ├── screens
│   │   ├── HomeScreen.js
│   │   ├── GroupDetailsScreen.js
│   │   ├── AddExpenseScreen.js
│   │   └── SettlementScreen.js
│   ├── storage
│   │   └── storage.js
│   └── utils
│       └── calculations.js
├── App.js
├── package.json
└── README.md
```

## Features
- **Home Screen**: Overview of group expenses and quick access to other features.
- **Group Details**: View detailed information about a specific group.
- **Add Expense**: Form to input new expenses.
- **Settlement**: Information on settling expenses among group members.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd my-react-native-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
To run the application, use the following command:
```
npm start
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.