'use strict';

module.exports = function (app) {

  const issues = {};

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let filters = req.query;
      let projectIssues = issues[project] || [];
      let filteredIssues = projectIssues.filter(issue => {
        return Object.keys(filters).every(key => issue[key] === filters[key]);
      });
      res.json(filteredIssues);
    })

    .post(function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      let newIssue = {
        _id: new Date().getTime().toString(),
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      };
      if (!issues[project]) {
        issues[project] = [];
      }
      issues[project].push(newIssue);
      res.json(newIssue);
    })

    .put(function (req, res) {
      let project = req.params.project;
      let { _id, ...fieldsToUpdate } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }
      let projectIssues = issues[project] || [];
      let issue = projectIssues.find(issue => issue._id === _id);
      if (!issue) {
        return res.json({ error: 'could not update', '_id': _id });
      }
      Object.keys(fieldsToUpdate).forEach(key => {
        issue[key] = fieldsToUpdate[key];
      });
      issue.updated_on = new Date();
      res.json({ result: 'successfully updated', _id: _id });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let { _id } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      let projectIssues = issues[project] || [];
      let issueIndex = projectIssues.findIndex(issue => issue._id === _id);
      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', '_id': _id });
      }
      projectIssues.splice(issueIndex, 1);
      res.json({ result: 'successfully deleted', '_id': _id });
    });

};
