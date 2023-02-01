# UI

- [] The house image on the detail page on the desktop screen does not have a fixed width, which result in smaller images not looking well. Also, the recommendations should be placed next to the house details on desktop.
- [x] After editing a house, the user should be redirected to the details screen.
- [-] When editing a house, the image is not shown. "**_WERKS ON MY MACHINE_** :shruggie: "
- [ ] When uploading an image with the wrong format on the create house page, I don't get a validation error on the image field, which makes it difficult as a user to understand what field I entered wrong.

# Format

- [x] In several functions, unclear variable names are used, which make the code hard to read.
- [x] Monetary values are not formatted well.
- [ ] Sometimes I see complicated code statements can be simplified by using Javascript's functionality. For the sorting, you can use the .reverse method for switching between ascending and descending sorting.

# Structure

- [ ] Long statements can better be placed in the setup part, instead of the template.
- [x] For making requests in the store, you can use a variable for the base url, to apply the DRY principle.
- [x] Instead of retrieving the house for the detail page in the getters, you should place the logic for finding a house in an action, and setting a state for the house to show on the detail page. Getters should only return properties of the state object.
- [x] There is some inconsistency with the routing, some routes are accessed using router-link, the others using a function. Please make this consistent.
- [ ] In the requirements is stated that UI libraries cannot be used. Here Tailwind is used, which is also a UI library. Make sure to replace this with CSS.

# Logic

- [ ] Sorting is not working, probably has to do with reactivity.
- [ ] When editing a house, try again is shown on the button, while the edit call was done successfully.
- [ ] After trying to submit the form for creating a house with an empty description, I get a validation error so this works correctly. But after this, if I enter a description and submit, the call is still not being made, because the validation state is not updated.
- [ ] It's not possible to submit a house when uploading a jpg file. Please take a look at the docs.
- [x] When searching, make sure to make it case insensitive. When searching on 'Amsterdam', I don't find any houses. When searching on 'amsterdam' it works.
