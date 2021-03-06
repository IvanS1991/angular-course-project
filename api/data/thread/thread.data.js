const Thread = require('./thread.model');
const Post = require('./post.model');

const threadsData = (db) => {
  const threadDb = db.collection('threads');

  const getThreads = () => {
    return new Promise((resolve, reject) => {
      threadDb.find({})
        .toArray((err, res) => {
          if (err) {
            return reject(err);
          }
          // const startIndex = (pageIndex - 1) * perPage || 0;
          // const endIndex = startIndex + perPage || res.length;
          return resolve(res.reverse());
        });
    });
  };

  const getThread = (id) => {
    return new Promise((resolve, reject) => {
      threadDb.findOne({ id }, (err, match) => {
        if (!match) {
          return reject(new Error('No such thread!'));
        }
        if (err) {
          return reject(err);
        }
        return resolve(match);
      });
    });
  };

  const createThread = (threadData) => {
    const newPost = new Post(threadData.content);
    const newThread = new Thread({
      author: threadData.author,
      title: threadData.title,
      originalPost: newPost,
      category: threadData.category,
    });
    return new Promise((resolve, reject) => {
      threadDb.insertOne(newThread, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(newThread);
      });
    });
  };

  const deleteThread = (threadId) => {
    return new Promise((resolve, reject) => {
      threadDb.deleteOne({ id: threadId }, (err, operation) => {
        if (operation.result.nModified === 0) {
          return reject(new Error('Cannot delete thread!'));
        }
        if (err) {
          return reject(err);
        }
        return resolve('Successfuly deleted thread!');
      });
    });
  };

  const createPost = (options) => {
    const { author, threadId, postData } = options;
    const newPost = new Post(postData.content);
    newPost.author = author;
    newPost.id = Post.getId();
    newPost.created = Post.getCreated();
    return new Promise((resolve, reject) => {
      return threadDb
        .updateOne({ id: threadId }, {
          $push: { posts: newPost },
        }, (err, operation) => {
          if (err) {
            return reject(err);
          }
          return resolve(newPost);
        });
    });
  };

  const editPost = (options) => {
    const { author, newContent, threadId, postId } = options;
    return new Promise((resolve, reject) => {
      return threadDb
        .findOneAndUpdate({
          id: threadId,
          'posts.id': postId,
          'posts.author': author,
        },
        {
          $set: { 'posts.$.content': newContent,
                  'posts.$.lastEdited': (new Date()).toISOString() },
        },
        (err, result) => {
          if (err) {
            return reject(err);
          }
          threadDb
            .findOne({ id: threadId }, (findErr, thread) => {
              if (findErr) {
                return reject(findErr);
              }
              return resolve(thread);
            });
        });
    });
  };

  const deletePost = (options) => {
    const { author, threadId, postId } = options;
    return new Promise((resolve, reject) => {
      return threadDb
        .updateOne({ id: threadId },
          { $pull: { posts: { author: author, id: postId } } },
          (err, operation) => {
            if (operation.result.nModified === 0) {
              return reject(new Error('Cannot delete post!'));
            }
            if (err) {
              return reject(err);
            }
            threadDb
              .findOne({ id: threadId }, (findErr, thread) => {
                if (findErr) {
                  return reject(findErr);
                }
                return resolve(thread);
              });
          });
    });
  };

  return {
    getThreads,
    getThread,
    createThread,
    deleteThread,
    createPost,
    deletePost,
    editPost,
  };
};

module.exports = threadsData;
