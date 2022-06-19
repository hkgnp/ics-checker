const express = require("express");
const router = express.Router();

const { Organisation } = require("../models");

const { checkIfSuperUser } = require("../middlewares");

router.get("/", checkIfSuperUser, async (req, res) => {
  let allOrgs = await Organisation.fetchAll();

  res.render("admin-update", {
    allOrgs: allOrgs.toJSON(),
  });
});

router.post("/", async (req, res) => {
  const numberOfServices = process.env.NO_OF_SERVICES;

  let i = 1;
  while (i <= numberOfServices) {
    let serviceToUpdate = await Organisation.where({
      id: i,
    }).fetch({
      require: false,
    });

    let icsData = {
      earliest_admission: req.body["earliest_admission"],
      medifund_cases: req.body["medifund_cases" + i.toString()],
      special_remarks: req.body["special_remarks" + i.toString()],
    };

    serviceToUpdate.set(icsData);
    serviceToUpdate.set("last_updated", new Date());
    serviceToUpdate.save();

    i++;
  }

  req.flash("success_messages", "ICS details successfully updated!");
  res.redirect("/");
});

module.exports = router;
