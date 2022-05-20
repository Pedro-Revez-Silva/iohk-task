## Simple test repo to test a mock REST service

To run the tests:

1. Clone the repository.
2. Run the command `npm install`.
3. Run the command `npm test`.

Note if there is a failure the first time the tests run regardint a timeout, this happens because the service is idle and takes longer to respond. The testing command has a timeout setup to prevent this, but its hard to test.

## Bugs found

There is no description or specifications on what this services does, so its not easy to know if its not working as intended, however, there are two things that could be improved:

1. Error messaged in the `GET` endpoints should be done according to the OpenAPI specifications. I.E. responding with HTTP code 404 and a JSON with the error description when a property isn't found instead of a 200. 

2. Currently there is no endpoint to `GET` all the metadata file names available, there is a url that will respond with that within an HTML file so I can't dynamically retrieve information to test. This means the test will fail if those files are removed or the name is changed. 

## TO-DO

1. There are some abstractions that could be added to the tests to make them easier to maintain. 
2. Add some further assertions, for example use the information from the `metadata` endpoint to check if the `properties` endpoint responnds with all the information for a property.
3. Get a better understanding where this service would be used used.

