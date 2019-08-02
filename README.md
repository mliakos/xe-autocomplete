# xe-autocomplete
Autocomplete React component made using Ant Design framework. 

# Overview
- Data for the autocompletion is retrieved from Xrysi Eukairia's API.
- Requests are made using debouncing (request happens after a specified timeout that the user has stopped typing).[Prop-type: debounce (number)]
- Results can be limited for different devices (desktop/tablet/mobile). [Prop-type: xResultsLimit where x = desktop/tablet/mobile (number)]
- There is a sample banner card only on desktop and mobile layout which changes position responsively.
- Specify query length after which requests should be made. [Prop-type: minChars (number)]
- Button which uppon click makes a Google search with the selected search result as the query.
- Caching mechanism that stores the results for a specified time. If results for a query already exist in cache, no request is made and cache is used instead. [Prop-type: cachingTimeThreshold (number)]

# Setup
1) Download and install the latest LTS version of Node.js
2) Open a terminal in project's root directory and run 'npm install', to install all the necessary node modules
3) When finished run 'npm start' to start the development server
4) Open a browser and go to 'localhost:3000'

# Libraries used
Ant Design base component: https://ant.design/components/auto-complete/
Lodash debounce method: https://www.npmjs.com/package/lodash.debounce
