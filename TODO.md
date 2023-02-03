# UI

- [] The house image on the detail page on the desktop screen does not have a fixed width, which result in smaller images not looking well. Also, the recommendations should be placed next to the house details on desktop.
- [ ] In the requirements is stated that UI libraries cannot be used. Here Tailwind is used, which is also a UI library. Make sure to replace this with CSS.
- [ ] not deleting houses properly after unsuccessful image upload

# Logic

- [-] Sorting is not working, probably has to do with reactivity.**_ Not sure why this doesnt work, watchEffect correctly tracks dependancies_**
- [-] It's not possible to submit a house when uploading a jpg file. Please take a look at the docs. **_ Added support for jpeg_**

- [-] When editing a house, the image is not shown. **_ werks on my machine_**
