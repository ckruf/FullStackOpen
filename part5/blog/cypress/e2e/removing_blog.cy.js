/*
Prep steps:
1) clearDB
2) registerTestUser
3) postTestBlog
4) loginTestUser

Test 1 - user who posted blog can delete it - steps:
1) click expand button .expandBtn (there is only one blog, so no ambiguity)
2) assert that removeBtn is in the DOM (.removeBtn)
3) click removeBtn
4) confirm window.confirm dialog
5) assert that blog is not in the DOM anymore (either no elements with .singleBlog and/or blog title not on page anymore)

Test 2 - user who did not post blog can not delete it - steps:
0) make sure test blog was posted by different author that logged in
1) click expans button .expandBtn
2) assert that removeBtn is NOT in the DOM (.removeBtn)
*/