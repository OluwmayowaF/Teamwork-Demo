// Import important modules
const Helper = require('../controller/helper');
// const cloudinary = require('cloudinary').v2;
const db = require('../db/index');


module.exports = {
  async createGif(req, res) {
    if (!req.files) {
      return res.status(400).json({
        status: 'error',
        error: 'Kindly upload your image to proceed',
      });
    } if (!req.body.title) {
      return res.status(400).json({
        status: 'error',
        error: 'Enter a title for your gif',
      });
    }
    const gifImage = req.files.image;
    const image = await Helper.uploadToCloudinary(gifImage);

    const text = `INSERT INTO 
      gifs(ownerId, title, imageUrl)
      values($1, $2, $3) returning *`;
    const values = [
      req.user.id,
      req.body.title,
      image.url,
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).json({
        status: 'success',
        data: {
          message: 'GIF image successfully posted',
          gifId: rows[0].id,
          createdOn: rows[0].created_on,
          title: rows[0].title,
          article: rows[0].imageUrl,
          gif: rows[0],
        },

      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  async deleteGif(req, res) {
    const findgif = `DELETE FROM 
    gifs WHERE id = $1 AND ownerId = $2 returning *`;

    try {
      const { rows } = await db.query(findgif, [req.params.gifId, req.user.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 'error',
          error: 'Gif was not found!!',
        });
      } return res.status(200).json({
        status: 'success',
        data: {
          message: 'Gif succesfully Deleted',
        },
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  async addComment(req, res) {
    if (!req.body.comment) {
      return res.status(400).json({
        status: 'error',
        error: 'Your comment must have some content ',
      });
    }
    // Fetch Gif
    const findgif = `SELECT * FROM
    gifs WHERE id = $1`;

    const addComment = `INSERT INTO 
    gifs_comments(ownerId, gifId, comment) 
    values($1, $2, $3) returning *`;

    const values = [
      req.user.id,
      req.params.gifId,
      req.body.comment,
    ];

    try {
      const gif = await db.query(findgif, [req.params.gifId]);
      if (!gif.rows[0]) {
        return res.status(404).json({
          status: 'error',
          error: 'Gif was not found!!',
        });
      } const comment = await db.query(addComment, values);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Comment succesfully Added',
          createdOn: comment.rows[0].created_on,
          Giftitle: gif.rows[0].title,
          Gif: gif.rows[0].imageUrl,
          comment: comment.rows[0].comment,
        },
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  async getGif(req, res) {
    const findGif = `SELECT *
    FROM gifs
    WHERE id = $1`;
    const findComment = `SELECT * FROM
    gifs_comments WHERE gifId= $1`;

    try {
      const { rows } = await db.query(findGif, [req.params.gifId]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'That Gif does not exist!' });
      }
      const comments = await db.query(findComment, [req.params.gifId]);
      return res.status(200).json({
        status: 'success',
        data: {
          id: rows[0].id,
          createdOn: rows[0].created_on,
          title: rows[0].title,
          url: rows[0].imageUrl,
          comments: comments.rows,
        },
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  async flagGif(req, res) {
    const findgif = `SELECT *
    FROM gifs
    WHERE id = $1`;
    const flaggif = `UPDATE gifs
    SET flags = flags + 1
    WHERE id = $1 returning *`;

    try {
      const gif = await db.query(findgif, [req.params.gifId]);
      if (!gif.rows[0]) {
        return res.status(404).json({
          status: 'error',
          error: 'Gif was not found!!',
        });
      }

      const flag = await db.query(flaggif, [req.params.gifId]);
      return res.status(200).json({
        status: 'success',
        error: 'Flaged as inappropraite',
        data: flag.rows,
      });
    } catch (error) {
      return res.status(500);
    }
  },

  async deleteFlaged(req, res) {
    const findgif = `SELECT *
    FROM gifs
    WHERE id = $1 AND flags > 1`;
    const deletegif = `DELETE FROM 
    gifs WHERE id = $1`;

    try {
      const { rows } = await db.query(findgif, [req.params.gifId]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 'error',
          error: 'Flagged Gif was not found',
        });
      }  await db.query(deletegif, [req.params.gifId]);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Gif deleted succesfully',
        },
      });
    } catch (error) {
      return res.status(500);
    }
  },

};
