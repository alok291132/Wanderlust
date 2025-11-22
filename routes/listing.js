const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConnfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingcontroller.index))

.post( 
    isLoggedIn, 
     
    upload.single('listing[image]'),
    
    validateListing,
    wrapAsync(listingcontroller.createListing)
);


// New Route
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router.post("/category", async (req, res) => {
    try {
        let categoryName = req.body.category;
        console.log(categoryName);
        const allListings = await Listing.find({category : categoryName})
        res.render("listings/index.ejs", {allListings})
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
});

router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(
    isLoggedIn, 
    isOwner, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.deleteListing));






// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm));





module.exports = router;