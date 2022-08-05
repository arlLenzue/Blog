const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./app/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.post("",multer({ storage: storage }).single("image"),
  (req, res, next) => {

    const url = req.protocol + "://" + req.get("host");

    let imagePath = url + "/images/default-image.png";

    if (req.file) {
      imagePath = url + "/images/" + req.file.filename;
    }
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });

    blog.save((err, data) => {
      if (!err) {
        res.status(200).json(data);
      } else {
        res.status(500).json(err);
      }
    });
  }
);

router.get("", (req, res, next) => {
  const skip = req.body.skip;
  const limit = req.body.limit;
  const sort = req.body.sort;

  const filter = {
    field: req.body.filter?.field,
    value: req.body.filter?.value,
  };

  let query = {};

  if (filter.field && filter.value) {
    query = {
      [filter.field]: {
        $regex: filter.value,
      },
    };
  } else if (filter.value) {
    query = {
      $or: [
        { title: { $regex: filter.value } },
        { content: { $regex: filter.value } },
      ],
    };
  }

  Blog.find(query, (err, data) => {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(404).json(err);
    }
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);
});

router.get("/:id", (req, res, next) => {
  Blog.findById(req.params.id, (err, data) => {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(404).json(err);
    }
  });
});

router.put( "/:id",multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const blog = {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    };

    Blog.updateOne({ _id: req.params.id }, blog, (err, data) => {
      if (!err) {
        res.status(200).json(data);
      } else {
        res.status(401).json(err);
      }
    });
  }
);

router.delete("/:id", (req, res, next) => {
  Blog.deleteOne({ _id: req.params.id }, (err, data) => {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(401).json(err);
    }
  });
});

module.exports = router;
