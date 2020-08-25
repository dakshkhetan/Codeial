const queue = require('../config/kue');
const commentsMailers = require('../mailers/comments_mailer');

queue.process('emails', function (job, done) {
  console.log('email worker is processing a job', job.data);

  commentsMailers.newComment(job.data);

  done();
});
