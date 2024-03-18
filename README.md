## crm.testing 

### Overview
cypress.io testing project for First Freight CRM

### Run the project
**Pre requisites:**
* Node.js version 10+
* Cloned the CRM6 project
 

1. Change directory to the crm.testing folder - ```cd crm.testing```
2. All test steps are in one command, so run ```npm run cy:run:record:live```. 

**This will:**
    * Locate the Cypress Project ID and Key from the cypress config
    * Run all tests
    * Record all tests on the Cypress dashboard
    * Post test:
        * Merge report JSON files
        * Generate a Mochawesome HTML report
3. Check Cypress dashboard for a more in depth report of failures and passes
4. Navigate to your file explorer and go to CRM.testing/mochawesome-report root to locate the HTML report

### Environment Variables
We use environment variables so we can test accross environments and we can easily test user roles. 

**Example**
```sh
{
  "CYPRESS_PROJECT_ID": "***",
  "CYPRESS_RECORD_KEY": "***",

  "baseUrl": "https://develop.firstfreight.com/",
  "subscriberId": 283,

  "users": {
    "salesRep": {
      "username": "brendon@firstfreight.com",
      "password": "FF2020!",
      "userId": 16036,
      "globalUserId": 13752,
      "details": {
        "address": "1 Gangplank Road",
        "city": "Birmingham",
        "country": "United Kingdom",
        "email": "brendon@firstfreight.com",
        "jobTitle": "Sales Rep",
        "name": "Brendon Hartley",
        "number": "07111222333",
        "postcode": "E5 TSM"
      }
    }
  }
}
```